using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Application.DTOs.Communications;

// ── Announcements ─────────────────────────────────────────────────────────

public record AnnouncementListDto(
    int Id,
    string Title,
    AnnouncementPriority Priority,
    AnnouncementStatus Status,
    string CreatedByName,
    DateTime CreatedAt,
    DateTime? ExpiresAt,
    int ReadCount,
    IEnumerable<string> TargetRoles
);

public record AnnouncementDetailDto(
    int Id,
    string Title,
    string Body,
    AnnouncementPriority Priority,
    AnnouncementStatus Status,
    DateTime? PublishAt,
    DateTime? ExpiresAt,
    string CreatedByName,
    DateTime CreatedAt,
    int ReadCount,
    IEnumerable<string> TargetRoles,
    IEnumerable<string> TargetGrades
);

public record CreateAnnouncementRequest(
    string Title,
    string Body,
    AnnouncementPriority Priority,
    AnnouncementStatus Status,
    DateTime? PublishAt,
    DateTime? ExpiresAt,
    IEnumerable<string> TargetRoles,
    IEnumerable<string> TargetGrades
);

public record UpdateAnnouncementRequest(
    string Title,
    string Body,
    AnnouncementPriority Priority,
    AnnouncementStatus Status,
    DateTime? ExpiresAt,
    IEnumerable<string> TargetRoles,
    IEnumerable<string> TargetGrades
);

// ── Messages ──────────────────────────────────────────────────────────────

public record MessageDto(
    int Id,
    Guid ThreadId,
    int FromUserId,
    string FromName,
    int ToUserId,
    string ToName,
    string? Subject,
    string Body,
    DateTime SentAt,
    bool IsRead
);

public record SendMessageRequest(int ToUserId, string? Subject, string Body, Guid? ReplyToThreadId);

// ── Meeting Slots ─────────────────────────────────────────────────────────

public record MeetingSlotDto(
    int Id,
    int TeacherId,
    string TeacherName,
    DateOnly MeetingDate,
    TimeOnly StartTime,
    TimeOnly EndTime,
    MeetingSlotStatus Status,
    string? BookedByName,
    string? StudentName,
    string? Notes
);

public record CreateMeetingSlotRequest(DateOnly MeetingDate, TimeOnly StartTime, TimeOnly EndTime, string? Notes);
public record BookMeetingSlotRequest(int StudentId, string? Notes);
