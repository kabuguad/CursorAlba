using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Academics;

// ── Request DTOs ──────────────────────────────────────────────────────────────

/// <summary>Payload for POST /api/academics/competencies</summary>
public class CreateCbcCompetencyDto
{
    [MaxLength(10)]
    public string Icon { get; set; } = "⭐";

    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(600)]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// When true, the card renders in the wider gold-accent "featured" style.
    /// </summary>
    public bool IsFeatured { get; set; } = false;

    /// <summary>
    /// Display position. When omitted the service appends at the end.
    /// </summary>
    public int? SortOrder { get; set; }
}

/// <summary>Payload for PUT /api/academics/competencies/{id}</summary>
public class UpdateCbcCompetencyDto
{
    [MaxLength(10)]
    public string Icon { get; set; } = "⭐";

    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(600)]
    public string Description { get; set; } = string.Empty;

    public bool IsFeatured { get; set; }

    public int SortOrder { get; set; }
}

// ── Response DTO ──────────────────────────────────────────────────────────────

/// <summary>
/// Shape returned by GET /api/academics/competencies and
/// GET /api/academics/competencies/{id}
/// </summary>
public class CbcCompetencyResponseDto
{
    public int      Id          { get; set; }
    public string   Icon        { get; set; } = string.Empty;
    public string   Title       { get; set; } = string.Empty;
    public string   Description { get; set; } = string.Empty;
    public bool     IsFeatured  { get; set; }
    public int      SortOrder   { get; set; }
    public DateTime CreatedAt   { get; set; }
    public DateTime UpdatedAt   { get; set; }
}
