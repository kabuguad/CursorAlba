using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Domain.Entities.People;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Application.Interfaces.Repositories;

public interface IStaffRepository : IBaseRepository<StaffMember>
{
    Task<StaffMember?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<StaffMember?> GetByStaffNoAsync(string staffNo, CancellationToken ct = default);
    Task<StaffMember?> GetWithSubjectsAsync(int id, CancellationToken ct = default);
    Task<PagedResult<StaffMember>> SearchAsync(string? search, string? department, StaffRole? role, StaffStatus? status, int page, int pageSize, CancellationToken ct = default);
    Task<bool> EmailExistsAsync(string email, int? excludeId = null, CancellationToken ct = default);
    Task<string> GenerateNextStaffNoAsync(CancellationToken ct = default);
    Task SoftDeleteAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<StaffMember>> GetByDepartmentAsync(string department, CancellationToken ct = default);
    Task<IEnumerable<StaffMember>> GetTeachersAsync(CancellationToken ct = default);
}
