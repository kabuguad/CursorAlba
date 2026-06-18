using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.WhyChooseUs;

// Accepted Color values (mirrors COLOR_OPTIONS in WhyChooseUsManager.tsx):
// gold · blue · green · purple · teal · rose · amber

// ── Request DTOs ──────────────────────────────────────────────────────────────

/// <summary>Payload for POST /api/why-choose-us/items</summary>
public class CreateWhyChooseUsItemDto
{
    [MaxLength(10)]
    public string Icon { get; set; } = "⭐";

    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Subtitle { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    /// <summary>Prominent stat figure — e.g. "97%", "86".</summary>
    [MaxLength(30)]
    public string Stat { get; set; } = string.Empty;

    /// <summary>Caption for the stat — e.g. "KCSE Pass Rate".</summary>
    [MaxLength(100)]
    public string StatLabel { get; set; } = string.Empty;

    /// <summary>
    /// Colour theme key.
    /// Accepted: gold · blue · green · purple · teal · rose · amber
    /// </summary>
    [MaxLength(20)]
    public string Color { get; set; } = "gold";

    /// <summary>
    /// Display position. When omitted the service appends at the end
    /// (max existing sort order + 1).
    /// </summary>
    public int? SortOrder { get; set; }

    /// <summary>Defaults to true — newly created items are visible immediately.</summary>
    public bool IsPublished { get; set; } = true;
}

/// <summary>Payload for PUT /api/why-choose-us/items/{id}</summary>
public class UpdateWhyChooseUsItemDto
{
    [MaxLength(10)]
    public string Icon { get; set; } = "⭐";

    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Subtitle { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(30)]
    public string Stat { get; set; } = string.Empty;

    [MaxLength(100)]
    public string StatLabel { get; set; } = string.Empty;

    [MaxLength(20)]
    public string Color { get; set; } = "gold";

    public int SortOrder { get; set; }

    public bool IsPublished { get; set; }
}

/// <summary>
/// Partial update DTO for PATCH /api/why-choose-us/items/{id}
/// Useful for toggling IsPublished without sending the full object.
/// </summary>
public class PatchWhyChooseUsItemDto
{
    /// <summary>When provided, updates the published visibility flag only.</summary>
    public bool? IsPublished { get; set; }

    /// <summary>When provided, updates the sort order only.</summary>
    public int? SortOrder { get; set; }
}

// ── Response DTO ──────────────────────────────────────────────────────────────

/// <summary>
/// Shape returned by GET /api/why-choose-us/items and
/// GET /api/why-choose-us/items/{id}
/// </summary>
public class WhyChooseUsItemResponseDto
{
    public int      Id          { get; set; }
    public string   Icon        { get; set; } = string.Empty;
    public string   Title       { get; set; } = string.Empty;
    public string   Subtitle    { get; set; } = string.Empty;
    public string   Description { get; set; } = string.Empty;
    public string   Stat        { get; set; } = string.Empty;
    public string   StatLabel   { get; set; } = string.Empty;
    public string   Color       { get; set; } = string.Empty;
    public int      SortOrder   { get; set; }
    public bool     IsPublished { get; set; }
    public DateTime CreatedAt   { get; set; }
    public DateTime UpdatedAt   { get; set; }
}
