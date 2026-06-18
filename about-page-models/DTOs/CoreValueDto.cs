using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.About;

// ── Request DTOs ──────────────────────────────────────────────────────────────

/// <summary>Payload for POST /api/about/core-values</summary>
public class CreateCoreValueDto
{
    /// <summary>Emoji or symbol — e.g. "🎓". Defaults to ⭐ if omitted.</summary>
    [MaxLength(10)]
    public string Icon { get; set; } = "⭐";

    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(150, ErrorMessage = "Title must be 150 characters or fewer.")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Description must be 500 characters or fewer.")]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Display position in the grid. When omitted the service appends the item
    /// at the end (max existing sort order + 1).
    /// </summary>
    public int? SortOrder { get; set; }
}

/// <summary>Payload for PUT /api/about/core-values/{id}</summary>
public class UpdateCoreValueDto
{
    [MaxLength(10)]
    public string Icon { get; set; } = "⭐";

    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}

// ── Response DTO ──────────────────────────────────────────────────────────────

/// <summary>Shape returned by GET /api/about/core-values and GET /api/about/core-values/{id}</summary>
public class CoreValueResponseDto
{
    public int      Id          { get; set; }
    public string   Icon        { get; set; } = string.Empty;
    public string   Title       { get; set; } = string.Empty;
    public string   Description { get; set; } = string.Empty;
    public int      SortOrder   { get; set; }
    public DateTime CreatedAt   { get; set; }
    public DateTime UpdatedAt   { get; set; }
}
