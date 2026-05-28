using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Domain.Entities.People;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Application.Interfaces.Repositories;

public interface IStudentRepository : IBaseRepository<Student>
{
    Task<Student?> GetByAdmNoAsync(string admNo, CancellationToken ct = default);
    Task<Student?> GetWithDetailsAsync(int id, CancellationToken ct = default);
    Task<PagedResult<Student>> SearchAsync(string? search, string? grade, StudentStatus? status, int page, int pageSize, CancellationToken ct = default);
    Task<bool> AdmNoExistsAsync(string admNo, int? excludeId = null, CancellationToken ct = default);
    Task<string> GenerateNextAdmNoAsync(CancellationToken ct = default);
    Task UpdateStatusAsync(int id, StudentStatus status, CancellationToken ct = default);
    Task SoftDeleteAsync(int id, CancellationToken ct = default);
    Task<int> GetActiveCountAsync(CancellationToken ct = default);
    Task<Dictionary<string, int>> GetCountsByGradeAsync(CancellationToken ct = default);
}
