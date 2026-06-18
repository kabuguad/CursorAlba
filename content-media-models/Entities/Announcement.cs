using System.ComponentModel.DataAnnotations;

namespace Entities.Models.Content;

// ── Enumerations ──────────────────────────────────────────────────────────────

public enum AnnouncementPriority
{
    Normal = 0,
    High   = 1,
    Urgent = 2
}

public enum AnnouncementStatus
{
    Draft     = 0,
    Published = 1
}

/// <summary>
/// Portal announcement targeted at one or more user roles.
/// Stored in the database; role targets are stored in <see cref="AnnouncementTarget"/>.
/// </summary>
public class Announcement
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Body { get; set; } = string.Empty;

    public AnnouncementPriority Priority { get; set; } = AnnouncementPriority.Normal;

    public AnnouncementStatus Status { get; set; } = AnnouncementStatus.Published;

    /// <summary>
    /// Optional category label (e.g. "Academic", "Sports", "Finance", "Emergency").
    /// </summary>
    [MaxLength(100)]
    public string? AnnouncementType { get; set; }

    /// <summary>When set, the announcement becomes visible only on/after this UTC time.</summary>
    public DateTime? PublishAt { get; set; }

    /// <summary>When set, the announcement stops appearing after this UTC time.</summary>
    public DateTime? ExpiresAt { get; set; }

    /// <summary>Engagement counter — incremented each time a user opens the announcement.</summary>
    public int ReadCount { get; set; } = 0;

    /// <summary>Display name of the admin who created the announcement.</summary>
    [MaxLength(200)]
    public string? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Navigation ────────────────────────────────────────────────────────────
    public ICollection<AnnouncementTarget> Targets { get; set; } = new List<AnnouncementTarget>();
}

/// <summary>
/// Join table: maps an announcement to a specific user role.
/// Valid roles: admin · teacher · parent · student
/// </summary>
public class AnnouncementTarget
{
    [Key]
    public int Id { get; set; }

    public int AnnouncementId { get; set; }

    /// <summary>Role identifier. One of: admin · teacher · parent · student</summary>
    [Required, MaxLength(50)]
    public string Role { get; set; } = string.Empty;

    // ── Navigation ────────────────────────────────────────────────────────────
    public Announcement Announcement { get; set; } = null!;
}
