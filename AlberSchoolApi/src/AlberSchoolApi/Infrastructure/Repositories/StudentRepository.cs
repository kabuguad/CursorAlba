using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.People;
using AlberSchoolApi.Domain.Enums;
using AlberSchoolApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AlberSchoolApi.Infrastructure.Repositories;

public class StudentRepository : BaseRepository<Student>, IStudentRepository
{
    public StudentRepository(AppDbContext db) : base(db) { }

    public async Task<Student?> GetByAdmNoAsync(string admNo, CancellationToken ct = default)
        => await _set.FirstOrDefaultAsync(s => s.AdmNo == admNo, ct);

    public async Task<Student?> GetWithDetailsAsync(int id, CancellationToken ct = default)
        => await _set
            .Include(s => s.EmergencyContacts)
            .Include(s => s.StudentParents).ThenInclude(sp => sp.User)
            .Include(s => s.TransportRoute)
            .FirstOrDefaultAsync(s => s.Id == id, ct);

    public async Task<PagedResult<Student>> SearchAsync(string? search, string? grade, StudentStatus? status, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking()
            .Include(s => s.Enrollments.OrderByDescending(e => e.EnrolledDate).Take(1))
                .ThenInclude(e => e.Class)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            q = q.Where(s => s.FirstName.Contains(search) || s.LastName.Contains(search) || s.AdmNo.Contains(search));
        if (!string.IsNullOrWhiteSpace(grade))
            q = q.Where(s => s.Enrollments.Any(e => e.Class.Grade == grade && e.Status == EnrollmentStatus.Active));
        if (status.HasValue) q = q.Where(s => s.Status == status.Value);

        var total = await q.CountAsync(ct);
        var items = await q.OrderBy(s => s.LastName).ThenBy(s => s.FirstName)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return new PagedResult<Student> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
    }

    public async Task<bool> AdmNoExistsAsync(string admNo, int? excludeId = null, CancellationToken ct = default)
        => await _set.AnyAsync(s => s.AdmNo == admNo && (excludeId == null || s.Id != excludeId), ct);

    public async Task<string> GenerateNextAdmNoAsync(CancellationToken ct = default)
    {
        var year = DateTime.UtcNow.Year.ToString()[2..];
        var count = await _set.CountAsync(ct) + 1;
        return $"ADM{year}{count:D4}";
    }

    public async Task UpdateStatusAsync(int id, StudentStatus status, CancellationToken ct = default)
    {
        await _set.Where(s => s.Id == id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(st => st.Status, status)
                .SetProperty(st => st.UpdatedAt, DateTime.UtcNow), ct);
    }

    public async Task SoftDeleteAsync(int id, CancellationToken ct = default)
    {
        await _set.Where(s => s.Id == id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(st => st.IsDeleted, true)
                .SetProperty(st => st.UpdatedAt, DateTime.UtcNow), ct);
    }

    public async Task<int> GetActiveCountAsync(CancellationToken ct = default)
        => await _set.CountAsync(s => s.Status == StudentStatus.Active, ct);

    public async Task<Dictionary<string, int>> GetCountsByGradeAsync(CancellationToken ct = default)
        => await _db.Enrollments
            .Where(e => e.Status == EnrollmentStatus.Active)
            .GroupBy(e => e.Class.Grade)
            .ToDictionaryAsync(g => g.Key, g => g.Count(), ct);
}
