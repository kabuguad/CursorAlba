using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.People;
using AlberSchoolApi.Domain.Enums;
using AlberSchoolApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AlberSchoolApi.Infrastructure.Repositories;

public class StaffRepository : BaseRepository<StaffMember>, IStaffRepository
{
    public StaffRepository(AppDbContext db) : base(db) { }

    public async Task<StaffMember?> GetByEmailAsync(string email, CancellationToken ct = default)
        => await _set.FirstOrDefaultAsync(s => s.Email == email.ToLower(), ct);

    public async Task<StaffMember?> GetByStaffNoAsync(string staffNo, CancellationToken ct = default)
        => await _set.FirstOrDefaultAsync(s => s.StaffNo == staffNo, ct);

    public async Task<StaffMember?> GetWithSubjectsAsync(int id, CancellationToken ct = default)
        => await _set
            .Include(s => s.StaffSubjects).ThenInclude(ss => ss.Subject)
            .FirstOrDefaultAsync(s => s.Id == id, ct);

    public async Task<PagedResult<StaffMember>> SearchAsync(string? search, string? department, StaffRole? role, StaffStatus? status, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            q = q.Where(s => s.FirstName.Contains(search) || s.LastName.Contains(search) || s.Email.Contains(search) || s.StaffNo.Contains(search));
        if (!string.IsNullOrWhiteSpace(department)) q = q.Where(s => s.Department == department);
        if (role.HasValue) q = q.Where(s => s.Role == role.Value);
        if (status.HasValue) q = q.Where(s => s.Status == status.Value);

        var total = await q.CountAsync(ct);
        var items = await q.OrderBy(s => s.LastName).ThenBy(s => s.FirstName)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return new PagedResult<StaffMember> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
    }

    public async Task<bool> EmailExistsAsync(string email, int? excludeId = null, CancellationToken ct = default)
        => await _set.AnyAsync(s => s.Email == email.ToLower() && (excludeId == null || s.Id != excludeId), ct);

    public async Task<string> GenerateNextStaffNoAsync(CancellationToken ct = default)
    {
        var count = await _set.CountAsync(ct) + 1;
        return $"STF{count:D4}";
    }

    public async Task SoftDeleteAsync(int id, CancellationToken ct = default)
    {
        await _set.Where(s => s.Id == id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(sm => sm.IsDeleted, true)
                .SetProperty(sm => sm.UpdatedAt, DateTime.UtcNow), ct);
    }

    public async Task<IEnumerable<StaffMember>> GetByDepartmentAsync(string department, CancellationToken ct = default)
        => await _set.AsNoTracking().Where(s => s.Department == department).ToListAsync(ct);

    public async Task<IEnumerable<StaffMember>> GetTeachersAsync(CancellationToken ct = default)
        => await _set.AsNoTracking().Where(s => s.Role == StaffRole.Teacher && s.Status == StaffStatus.Active).ToListAsync(ct);
}
