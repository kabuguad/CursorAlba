using System.ComponentModel.DataAnnotations;
using Entities.Models.Content;

namespace AlbaApi.Presentation.DTOs.Content;

// ── Request DTOs ──────────────────────────────────────────────────────────────

/// <summary>Payload for POST /api/announcements</summary>
public class CreateAnnouncementDto
{
    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(300, ErrorMessage = "Title must be 300 characters or fewer.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Body is required.")]
    public string Body { get; set; } = string.Empty;

    public AnnouncementPriority Priority { get; set; } = AnnouncementPriority.Normal;

    public AnnouncementStatus Status { get; set; } = AnnouncementStatus.Published;

    /// <summary>Category label — e.g. "General", "Academic", "Sports", "Finance", "Emergency", "Events".</summary>
    [MaxLength(100)]
    public string? AnnouncementType { get; set; }

    /// <summary>
    /// List of roles that should see this announcement.
    /// Valid values: admin · teacher · parent · student
    /// </summary>
    [Required(ErrorMessage = "At least one target role is required.")]
    [MinLength(1, ErrorMessage = "At least one target role is required.")]
    public List<string> TargetRoles { get; set; } = new();

    /// <summary>UTC date/time the announcement becomes active. Defaults to now.</summary>
    public DateTime? PublishAt { get; set; }

    /// <summary>UTC date/time after which the announcement is hidden. Null = no expiry.</summary>
    public DateTime? ExpiresAt { get; set; }
}

/// <summary>Payload for PUT /api/announcements/{id}</summary>
public class UpdateAnnouncementDto
{
    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Body is required.")]
    public string Body { get; set; } = string.Empty;

    public AnnouncementPriority Priority { get; set; }

    public AnnouncementStatus Status { get; set; }

    [MaxLength(100)]
    public string? AnnouncementType { get; set; }

    [Required]
    [MinLength(1, ErrorMessage = "At least one target role is required.")]
    public List<string> TargetRoles { get; set; } = new();

    public DateTime? PublishAt { get; set; }

    public DateTime? ExpiresAt { get; set; }
}

// ── Response DTOs ─────────────────────────────────────────────────────────────

/// <summary>Shape returned by GET /api/announcements and GET /api/announcements/{id}</summary>
public class AnnouncementResponseDto
{
    public int                     Id               { get; set; }
    public string                  Title            { get; set; } = string.Empty;
    public string                  Body             { get; set; } = string.Empty;
    public AnnouncementPriority    Priority         { get; set; }
    public AnnouncementStatus      Status           { get; set; }
    public string?                 AnnouncementType { get; set; }
    public List<string>            TargetRoles      { get; set; } = new();
    public DateTime?               PublishAt        { get; set; }
    public DateTime?               ExpiresAt        { get; set; }
    public int                     ReadCount        { get; set; }
    public string?                 CreatedBy        { get; set; }
    public DateTime                CreatedAt        { get; set; }
    public DateTime                UpdatedAt        { get; set; }
}
