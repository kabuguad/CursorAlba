using AlberSchoolApi.Domain.Entities.Common;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.Communications;

public class Announcement : AuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public AnnouncementPriority Priority { get; set; } = AnnouncementPriority.Normal;
    public AnnouncementStatus Status { get; set; } = AnnouncementStatus.Draft;
    public DateTime? PublishAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public int ReadCount { get; set; } = 0;
    public int CreatedBy { get; set; }

    public Identity.User Author { get; set; } = null!;
    public ICollection<AnnouncementTargetRole> TargetRoles { get; set; } = [];
    public ICollection<AnnouncementTargetGrade> TargetGrades { get; set; } = [];
    public ICollection<AnnouncementRead> Reads { get; set; } = [];
}

public class AnnouncementTargetRole
{
    public int AnnouncementId { get; set; }
    public string Role { get; set; } = string.Empty;

    public Announcement Announcement { get; set; } = null!;
}

public class AnnouncementTargetGrade
{
    public int AnnouncementId { get; set; }
    public string Grade { get; set; } = string.Empty;

    public Announcement Announcement { get; set; } = null!;
}

public class AnnouncementRead
{
    public int AnnouncementId { get; set; }
    public int UserId { get; set; }
    public DateTime ReadAt { get; set; } = DateTime.UtcNow;

    public Announcement Announcement { get; set; } = null!;
    public Identity.User User { get; set; } = null!;
}
