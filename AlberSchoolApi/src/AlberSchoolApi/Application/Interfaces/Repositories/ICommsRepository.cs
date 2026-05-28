using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Domain.Entities.Communications;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Application.Interfaces.Repositories;

public interface IAnnouncementRepository : IBaseRepository<Announcement>
{
    Task<Announcement?> GetWithTargetsAsync(int id, CancellationToken ct = default);
    Task<PagedResult<Announcement>> GetForRoleAsync(UserRole role, string? grade, int page, int pageSize, CancellationToken ct = default);
    Task<PagedResult<Announcement>> SearchAdminAsync(string? search, AnnouncementStatus? status, AnnouncementPriority? priority, int page, int pageSize, CancellationToken ct = default);
    Task IncrementReadCountAsync(int id, CancellationToken ct = default);
    Task MarkReadByUserAsync(int announcementId, int userId, CancellationToken ct = default);
    Task UpdateStatusAsync(int id, AnnouncementStatus status, CancellationToken ct = default);
}

public interface IMessageRepository : IBaseRepository<Message>
{
    Task<IEnumerable<Message>> GetInboxAsync(int userId, CancellationToken ct = default);
    Task<IEnumerable<Message>> GetSentAsync(int userId, CancellationToken ct = default);
    Task<IEnumerable<Message>> GetThreadAsync(Guid threadId, CancellationToken ct = default);
    Task MarkReadAsync(int messageId, CancellationToken ct = default);
    Task<int> GetUnreadCountAsync(int userId, CancellationToken ct = default);
}

public interface IMeetingSlotRepository : IBaseRepository<Domain.Entities.Academic.MeetingSlot>
{
    Task<IEnumerable<Domain.Entities.Academic.MeetingSlot>> GetByTeacherAsync(int teacherId, DateOnly? from = null, DateOnly? to = null, CancellationToken ct = default);
    Task<IEnumerable<Domain.Entities.Academic.MeetingSlot>> GetAvailableAsync(int teacherId, CancellationToken ct = default);
    Task<bool> HasOverlapAsync(int teacherId, DateOnly date, TimeOnly start, TimeOnly end, int? excludeId = null, CancellationToken ct = default);
}
