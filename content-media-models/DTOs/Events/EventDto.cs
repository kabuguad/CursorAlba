using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Content;

// ── Request DTOs ──────────────────────────────────────────────────────────────

/// <summary>Payload for POST /api/events</summary>
public class CreateEventDto
{
    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(300, ErrorMessage = "Title must be 300 characters or fewer.")]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required(ErrorMessage = "Start date is required.")]
    public DateTime StartDate { get; set; }

    /// <summary>Optional. When omitted the event is treated as single-day.</summary>
    public DateTime? EndDate { get; set; }

    [MaxLength(300)]
    public string? Location { get; set; }

    [MaxLength(2048)]
    [Url(ErrorMessage = "Image must be a valid URL.")]
    public string? ImageUrl { get; set; }

    public bool IsPublished { get; set; } = true;

    /// <summary>Category label — e.g. "Academic", "Sports", "Cultural", "Community".</summary>
    [MaxLength(100)]
    public string? EventType { get; set; }
}

/// <summary>Payload for PUT /api/events/{id}</summary>
public class UpdateEventDto
{
    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required(ErrorMessage = "Start date is required.")]
    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    [MaxLength(300)]
    public string? Location { get; set; }

    [MaxLength(2048)]
    [Url(ErrorMessage = "Image must be a valid URL.")]
    public string? ImageUrl { get; set; }

    public bool IsPublished { get; set; }

    [MaxLength(100)]
    public string? EventType { get; set; }
}

// ── Response DTO ──────────────────────────────────────────────────────────────

/// <summary>Shape returned by GET /api/events and GET /api/events/{id}</summary>
public class EventResponseDto
{
    public int       Id          { get; set; }
    public string    Title       { get; set; } = string.Empty;
    public string?   Description { get; set; }
    public DateTime  StartDate   { get; set; }
    public DateTime? EndDate     { get; set; }
    public string?   Location    { get; set; }
    public string?   ImageUrl    { get; set; }
    public bool      IsPublished { get; set; }
    public string?   EventType   { get; set; }
    public bool      IsPast      { get; set; }
    public DateTime  CreatedAt   { get; set; }
    public DateTime  UpdatedAt   { get; set; }
}
