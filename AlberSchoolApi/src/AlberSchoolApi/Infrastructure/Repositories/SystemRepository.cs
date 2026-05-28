using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.Identity;
using AlberSchoolApi.Domain.Entities.System;
using AlberSchoolApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AlberSchoolApi.Infrastructure.Repositories;

public class SystemSettingsRepository : ISystemSettingsRepository
{
    private readonly AppDbContext _db;
    public SystemSettingsRepository(AppDbContext db) => _db = db;

    public async Task<SystemSettings> GetAsync(CancellationToken ct = default)
    {
        var settings = await _db.SystemSettings
            .Include(s => s.CurrentAcademicYear)
            .Include(s => s.CurrentTerm)
            .FirstOrDefaultAsync(ct);

        if (settings is null)
        {
            settings = new SystemSettings { Id = 1, SchoolName = "Alber School" };
            await _db.SystemSettings.AddAsync(settings, ct);
            await _db.SaveChangesAsync(ct);
        }
        return settings;
    }

    public async Task<SystemSettings> UpdateAsync(SystemSettings settings, CancellationToken ct = default)
    {
        settings.UpdatedAt = DateTime.UtcNow;
        _db.SystemSettings.Update(settings);
        await _db.SaveChangesAsync(ct);
        return settings;
    }
}

public class SocialLinkRepository : BaseRepository<SocialLink>, ISocialLinkRepository
{
    public SocialLinkRepository(AppDbContext db) : base(db) { }

    public async Task<IEnumerable<SocialLink>> GetActiveOrderedAsync(CancellationToken ct = default)
        => await _set.AsNoTracking().Where(s => s.IsActive).OrderBy(s => s.SortOrder).ToListAsync(ct);
}

public class NotificationRepository : BaseRepository<Domain.Entities.System.Notification>, INotificationRepository
{
    public NotificationRepository(AppDbContext db) : base(db) { }

    public async Task<IEnumerable<Domain.Entities.System.Notification>> GetByUserAsync(int userId, bool unreadOnly = false, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking().Where(n => n.UserId == userId);
        if (unreadOnly) q = q.Where(n => !n.IsRead);
        return await q.OrderByDescending(n => n.CreatedAt).Take(50).ToListAsync(ct);
    }

    public async Task<int> GetUnreadCountAsync(int userId, CancellationToken ct = default)
        => await _set.CountAsync(n => n.UserId == userId && !n.IsRead, ct);

    public async Task MarkAllReadAsync(int userId, CancellationToken ct = default)
    {
        await _set.Where(n => n.UserId == userId && !n.IsRead)
            .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true).SetProperty(n => n.ReadAt, DateTime.UtcNow), ct);
    }
}

public class AuditLogRepository : IAuditLogRepository
{
    private readonly AppDbContext _db;
    public AuditLogRepository(AppDbContext db) => _db = db;

    public async Task<PagedResult<AuditLog>> SearchAsync(string? search, string? resource, string? action, DateTime? from, DateTime? to, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _db.AuditLogs.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(search)) q = q.Where(a => a.UserName.Contains(search) || (a.Details != null && a.Details.Contains(search)));
        if (!string.IsNullOrWhiteSpace(resource)) q = q.Where(a => a.Resource == resource);
        if (!string.IsNullOrWhiteSpace(action) && Enum.TryParse<Domain.Enums.AuditAction>(action, true, out var actionEnum)) q = q.Where(a => a.Action == actionEnum);
        if (from.HasValue) q = q.Where(a => a.Timestamp >= from.Value);
        if (to.HasValue) q = q.Where(a => a.Timestamp <= to.Value);
        var total = await q.CountAsync(ct);
        var items = await q.OrderByDescending(a => a.Timestamp).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return new PagedResult<AuditLog> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
    }

    public async Task AddAsync(AuditLog entry, CancellationToken ct = default)
        => await _db.AuditLogs.AddAsync(entry, ct);

    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
        => await _db.SaveChangesAsync(ct);
}
