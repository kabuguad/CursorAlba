using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.Identity;
using AlberSchoolApi.Domain.Enums;
using AlberSchoolApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AlberSchoolApi.Infrastructure.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(AppDbContext db) : base(db) { }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
        => await _set.FirstOrDefaultAsync(u => u.Email == email.ToLower(), ct);

    public async Task<User?> GetWithPermissionsAsync(int id, CancellationToken ct = default)
        => await _set
            .Include(u => u.UserPermissions).ThenInclude(up => up.Permission)
            .FirstOrDefaultAsync(u => u.Id == id, ct);

    public async Task<User?> GetByResetTokenAsync(string token, CancellationToken ct = default)
        => await _set.FirstOrDefaultAsync(u =>
            u.PasswordResetToken == token &&
            u.PasswordResetExpiresAt > DateTime.UtcNow, ct);

    public async Task<PagedResult<User>> SearchAsync(string? search, UserRole? role, UserStatus? status, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            q = q.Where(u => u.Name.Contains(search) || u.Email.Contains(search) || (u.Phone != null && u.Phone.Contains(search)));
        if (role.HasValue) q = q.Where(u => u.Role == role.Value);
        if (status.HasValue) q = q.Where(u => u.Status == status.Value);

        var total = await q.CountAsync(ct);
        var items = await q.OrderBy(u => u.Name).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return new PagedResult<User> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
    }

    public async Task<bool> EmailExistsAsync(string email, int? excludeId = null, CancellationToken ct = default)
        => await _set.AnyAsync(u => u.Email == email.ToLower() && (excludeId == null || u.Id != excludeId), ct);

    public async Task<Dictionary<UserRole, int>> GetCountsByRoleAsync(CancellationToken ct = default)
        => await _set.GroupBy(u => u.Role)
            .ToDictionaryAsync(g => g.Key, g => g.Count(), ct);

    public async Task UpdateStatusAsync(int id, UserStatus status, CancellationToken ct = default)
    {
        await _set.Where(u => u.Id == id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(u => u.Status, status)
                .SetProperty(u => u.UpdatedAt, DateTime.UtcNow), ct);
    }

    public async Task SoftDeleteAsync(int id, CancellationToken ct = default)
    {
        await _set.Where(u => u.Id == id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(u => u.IsDeleted, true)
                .SetProperty(u => u.UpdatedAt, DateTime.UtcNow), ct);
    }
}
