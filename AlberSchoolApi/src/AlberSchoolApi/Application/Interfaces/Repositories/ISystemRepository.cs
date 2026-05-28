using AlberSchoolApi.Domain.Entities.System;

namespace AlberSchoolApi.Application.Interfaces.Repositories;

public interface ISystemSettingsRepository
{
    Task<SystemSettings> GetAsync(CancellationToken ct = default);
    Task<SystemSettings> UpdateAsync(SystemSettings settings, CancellationToken ct = default);
}

public interface ISocialLinkRepository : IBaseRepository<SocialLink>
{
    Task<IEnumerable<SocialLink>> GetActiveOrderedAsync(CancellationToken ct = default);
}

public interface INotificationRepository : IBaseRepository<Notification>
{
    Task<IEnumerable<Notification>> GetByUserAsync(int userId, bool unreadOnly = false, CancellationToken ct = default);
    Task<int> GetUnreadCountAsync(int userId, CancellationToken ct = default);
    Task MarkAllReadAsync(int userId, CancellationToken ct = default);
}

public interface IAuditLogRepository
{
    Task<Application.Common.PagedResult<Domain.Entities.Identity.AuditLog>> SearchAsync(
        string? search, string? resource, string? action, DateTime? from, DateTime? to,
        int page, int pageSize, CancellationToken ct = default);
    Task AddAsync(Domain.Entities.Identity.AuditLog entry, CancellationToken ct = default);
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
