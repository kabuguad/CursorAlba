using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Domain.Entities.Admissions;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Application.Interfaces.Repositories;

public interface IAdmissionsRepository : IBaseRepository<AdmissionApplication>
{
    Task<AdmissionApplication?> GetByApplicationNoAsync(string applicationNo, CancellationToken ct = default);
    Task<AdmissionApplication?> GetWithDocumentsAsync(int id, CancellationToken ct = default);
    Task<PagedResult<AdmissionApplication>> SearchAsync(string? search, AdmissionStatus? status, int page, int pageSize, CancellationToken ct = default);
    Task<string> GenerateNextApplicationNoAsync(CancellationToken ct = default);
    Task UpdateStatusAsync(int id, AdmissionStatus status, int? reviewedBy = null, string? notes = null, CancellationToken ct = default);
    Task<Dictionary<AdmissionStatus, int>> GetCountsByStatusAsync(CancellationToken ct = default);
}
