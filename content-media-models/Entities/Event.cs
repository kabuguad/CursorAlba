using System.ComponentModel.DataAnnotations;

namespace Entities.Models.Content;

/// <summary>
/// Represents a school event shown on the public calendar and events pages.
/// </summary>
public class Event
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    /// <summary>
    /// Optional end date/time. When null the event is treated as a single-day event.
    /// </summary>
    public DateTime? EndDate { get; set; }

    [MaxLength(300)]
    public string? Location { get; set; }

    [MaxLength(2048)]
    public string? ImageUrl { get; set; }

    public bool IsPublished { get; set; } = true;

    /// <summary>
    /// Free-text category shown as a badge (e.g. "Academic", "Sports", "Cultural").
    /// </summary>
    [MaxLength(100)]
    public string? EventType { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Computed property ─────────────────────────────────────────────────────
    /// <summary>
    /// True when the event's end (or start, if no end date) has passed UTC now.
    /// Not mapped to the database — derived on read.
    /// </summary>
    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public bool IsPast => (EndDate ?? StartDate) < DateTime.UtcNow;
}
