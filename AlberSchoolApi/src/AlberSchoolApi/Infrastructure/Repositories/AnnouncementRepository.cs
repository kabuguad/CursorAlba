using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.Communications;
using AlberSchoolApi.Domain.Enums;
using AlberSchoolApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AlberSchoolApi.Infrastructure.Repositories;

public class AnnouncementRepository : BaseRepository<Announcement>, IAnnouncementRepository
{
    public AnnouncementRepository(AppDbContext db) : base(db) { }

    public async Task<Announcement?> GetWithTargetsAsync(int id, CancellationToken ct = default)
        => await _set
            .Include(a => a.TargetRoles)
            .Include(a => a.TargetGrades)
            .Include(a => a.Author)
            .FirstOrDefaultAsync(a => a.Id == id, ct);

    public async Task<PagedResult<Announcement>> GetForRoleAsync(UserRole role, string? grade, int page, int pageSize, CancellationToken ct = default)
    {
        var roleName = role.ToString().ToLower();
        var q = _set.AsNoTracking()
            .Include(a => a.TargetRoles)
            .Include(a => a.TargetGrades)
            .Include(a => a.Author)
            .Where(a => a.Status == AnnouncementStatus.Published &&
                (a.ExpiresAt == null || a.ExpiresAt > DateTime.UtcNow) &&
                a.TargetRoles.Any(tr => tr.Role.ToLower() == roleName));

        if (!string.IsNullOrWhiteSpace(grade))
            q = q.Where(a => !a.TargetGrades.Any() || a.TargetGrades.Any(tg => tg.Grade == grade));

        var total = await q.CountAsync(ct);
        var items = await q.OrderByDescending(a => a.Priority).ThenByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return new PagedResult<Announcement> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
    }

    public async Task<PagedResult<Announcement>> SearchAdminAsync(string? search, AnnouncementStatus? status, AnnouncementPriority? priority, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking().Include(a => a.TargetRoles).Include(a => a.Author).AsQueryable();
        if (!string.IsNullOrWhiteSpace(search)) q = q.Where(a => a.Title.Contains(search));
        if (status.HasValue) q = q.Where(a => a.Status == status.Value);
        if (priority.HasValue) q = q.Where(a => a.Priority == priority.Value);
        var total = await q.CountAsync(ct);
        var items = await q.OrderByDescending(a => a.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return new PagedResult<Announcement> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
    }

    public async Task IncrementReadCountAsync(int id, CancellationToken ct = default)
    {
        await _set.Where(a => a.Id == id)
            .ExecuteUpdateAsync(s => s.SetProperty(a => a.ReadCount, a => a.ReadCount + 1), ct);
    }

    public async Task MarkReadByUserAsync(int announcementId, int userId, CancellationToken ct = default)
    {
        var exists = await _db.AnnouncementReads.AnyAsync(ar => ar.AnnouncementId == announcementId && ar.UserId == userId, ct);
        if (!exists)
        {
            await _db.AnnouncementReads.AddAsync(new AnnouncementRead { AnnouncementId = announcementId, UserId = userId }, ct);
            await _db.SaveChangesAsync(ct);
        }
    }

    public async Task UpdateStatusAsync(int id, AnnouncementStatus status, CancellationToken ct = default)
    {
        await _set.Where(a => a.Id == id)
            .ExecuteUpdateAsync(s => s.SetProperty(a => a.Status, status).SetProperty(a => a.UpdatedAt, DateTime.UtcNow), ct);
    }
}

public class MessageRepository : BaseRepository<Message>, IMessageRepository
{
    public MessageRepository(AppDbContext db) : base(db) { }

    public async Task<IEnumerable<Message>> GetInboxAsync(int userId, CancellationToken ct = default)
        => await _set.AsNoTracking().Include(m => m.FromUser)
            .Where(m => m.ToUserId == userId && !m.IsDeletedByRecipient)
            .OrderByDescending(m => m.SentAt).ToListAsync(ct);

    public async Task<IEnumerable<Message>> GetSentAsync(int userId, CancellationToken ct = default)
        => await _set.AsNoTracking().Include(m => m.ToUser)
            .Where(m => m.FromUserId == userId && !m.IsDeletedBySender)
            .OrderByDescending(m => m.SentAt).ToListAsync(ct);

    public async Task<IEnumerable<Message>> GetThreadAsync(Guid threadId, CancellationToken ct = default)
        => await _set.AsNoTracking().Include(m => m.FromUser)
            .Where(m => m.ThreadId == threadId)
            .OrderBy(m => m.SentAt).ToListAsync(ct);

    public async Task MarkReadAsync(int messageId, CancellationToken ct = default)
    {
        await _set.Where(m => m.Id == messageId)
            .ExecuteUpdateAsync(s => s.SetProperty(m => m.ReadAt, DateTime.UtcNow), ct);
    }

    public async Task<int> GetUnreadCountAsync(int userId, CancellationToken ct = default)
        => await _set.CountAsync(m => m.ToUserId == userId && m.ReadAt == null && !m.IsDeletedByRecipient, ct);
}
