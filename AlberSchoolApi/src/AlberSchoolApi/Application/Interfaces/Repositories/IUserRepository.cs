using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Domain.Entities.Identity;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Application.Interfaces.Repositories;

public interface IUserRepository : IBaseRepository<User>
{
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<User?> GetWithPermissionsAsync(int id, CancellationToken ct = default);
    Task<User?> GetByResetTokenAsync(string token, CancellationToken ct = default);
    Task<PagedResult<User>> SearchAsync(string? search, UserRole? role, UserStatus? status, int page, int pageSize, CancellationToken ct = default);
    Task<bool> EmailExistsAsync(string email, int? excludeId = null, CancellationToken ct = default);
    Task<Dictionary<UserRole, int>> GetCountsByRoleAsync(CancellationToken ct = default);
    Task UpdateStatusAsync(int id, UserStatus status, CancellationToken ct = default);
    Task SoftDeleteAsync(int id, CancellationToken ct = default);
}
