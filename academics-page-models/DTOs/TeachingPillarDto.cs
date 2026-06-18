using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Academics;

// Accepted Gradient values (mirrors GRADIENT_MAP in the frontend):
// green · blue · amber · purple · red · teal · indigo · pink · gold · slate

// ── Request DTOs ──────────────────────────────────────────────────────────────

/// <summary>Payload for POST /api/academics/pillars</summary>
public class CreateTeachingPillarDto
{
    [MaxLength(10)]
    public string Icon { get; set; } = "📌";

    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(600)]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Card gradient colour key.
    /// Accepted: green · blue · amber · purple · red · teal · indigo · pink · gold · slate
    /// </summary>
    [MaxLength(20)]
    public string Gradient { get; set; } = "green";

    /// <summary>
    /// Display position. When omitted the service appends at the end.
    /// </summary>
    public int? SortOrder { get; set; }
}

/// <summary>Payload for PUT /api/academics/pillars/{id}</summary>
public class UpdateTeachingPillarDto
{
    [MaxLength(10)]
    public string Icon { get; set; } = "📌";

    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(600)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(20)]
    public string Gradient { get; set; } = "green";

    public int SortOrder { get; set; }
}

// ── Response DTO ──────────────────────────────────────────────────────────────

/// <summary>
/// Shape returned by GET /api/academics/pillars and
/// GET /api/academics/pillars/{id}
/// </summary>
public class TeachingPillarResponseDto
{
    public int      Id          { get; set; }
    public string   Icon        { get; set; } = string.Empty;
    public string   Title       { get; set; } = string.Empty;
    public string   Description { get; set; } = string.Empty;
    public string   Gradient    { get; set; } = string.Empty;
    public int      SortOrder   { get; set; }
    public DateTime CreatedAt   { get; set; }
    public DateTime UpdatedAt   { get; set; }
}
