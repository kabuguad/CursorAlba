using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.About;

// ── Request DTOs ──────────────────────────────────────────────────────────────

/// <summary>Payload for POST /api/about/history</summary>
public class CreateHistoryMilestoneDto
{
    /// <summary>
    /// Year label displayed on the timeline — typically four digits, e.g. "2005".
    /// Stored as a string to allow ranges like "2005–2008".
    /// </summary>
    [Required(ErrorMessage = "Year is required.")]
    [MaxLength(20, ErrorMessage = "Year must be 20 characters or fewer.")]
    public string Year { get; set; } = string.Empty;

    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(200, ErrorMessage = "Title must be 200 characters or fewer.")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(800, ErrorMessage = "Description must be 800 characters or fewer.")]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Display position on the timeline. When omitted the service appends the item
    /// at the end (max existing sort order + 1).
    /// </summary>
    public int? SortOrder { get; set; }
}

/// <summary>Payload for PUT /api/about/history/{id}</summary>
public class UpdateHistoryMilestoneDto
{
    [Required(ErrorMessage = "Year is required.")]
    [MaxLength(20)]
    public string Year { get; set; } = string.Empty;

    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(800)]
    public string Description { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}

// ── Response DTO ──────────────────────────────────────────────────────────────

/// <summary>Shape returned by GET /api/about/history and GET /api/about/history/{id}</summary>
public class HistoryMilestoneResponseDto
{
    public int      Id          { get; set; }
    public string   Year        { get; set; } = string.Empty;
    public string   Title       { get; set; } = string.Empty;
    public string   Description { get; set; } = string.Empty;
    public int      SortOrder   { get; set; }
    public DateTime CreatedAt   { get; set; }
    public DateTime UpdatedAt   { get; set; }
}
