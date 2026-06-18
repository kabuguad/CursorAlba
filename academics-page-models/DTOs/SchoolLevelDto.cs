using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Academics;

// Accepted ColorKey values (mirrors LEVEL_COLOR_MAP in the frontend):
// pink · green · blue · violet · amber · teal · gold · purple · red · slate

// ── Request DTOs ──────────────────────────────────────────────────────────────

/// <summary>Payload for POST /api/academics/levels</summary>
public class CreateSchoolLevelDto
{
    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// URL-friendly slug — lowercase, hyphens only.
    /// Auto-generated from Name if omitted (service responsibility).
    /// Must be unique across all levels.
    /// </summary>
    [MaxLength(100)]
    public string? Slug { get; set; }

    [MaxLength(100)]
    public string Ages { get; set; } = string.Empty;

    [MaxLength(10)]
    public string Icon { get; set; } = "📚";

    /// <summary>
    /// Card colour theme key.
    /// Accepted: pink · green · blue · violet · amber · teal · gold · purple · red · slate
    /// </summary>
    [MaxLength(20)]
    public string ColorKey { get; set; } = "blue";

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Learning areas — one per line, e.g. "English\nKiswahili\nMathematics".
    /// The API stores this as a single string and splits on '\n' in responses.
    /// </summary>
    public string Highlights { get; set; } = string.Empty;

    /// <summary>
    /// Display position. When omitted the service appends at the end
    /// (max existing sort order + 1).
    /// </summary>
    public int? SortOrder { get; set; }
}

/// <summary>Payload for PUT /api/academics/levels/{id}</summary>
public class UpdateSchoolLevelDto
{
    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Slug is required.")]
    [MaxLength(100)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Ages { get; set; } = string.Empty;

    [MaxLength(10)]
    public string Icon { get; set; } = "📚";

    [MaxLength(20)]
    public string ColorKey { get; set; } = "blue";

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    public string Highlights { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}

// ── Response DTO ──────────────────────────────────────────────────────────────

/// <summary>
/// Shape returned by GET /api/academics/levels and GET /api/academics/levels/{id}
/// <see cref="Highlights"/> is split into a string array for convenient frontend use.
/// </summary>
public class SchoolLevelResponseDto
{
    public int      Id          { get; set; }
    public string   Slug        { get; set; } = string.Empty;
    public string   Name        { get; set; } = string.Empty;
    public string   Ages        { get; set; } = string.Empty;
    public string   Icon        { get; set; } = string.Empty;
    public string   ColorKey    { get; set; } = string.Empty;
    public string   Description { get; set; } = string.Empty;

    /// <summary>
    /// Learning areas split from the newline-delimited Highlights string.
    /// Service maps: <c>entity.Highlights.Split('\n', StringSplitOptions.RemoveEmptyEntries)</c>
    /// </summary>
    public string[] Highlights  { get; set; } = Array.Empty<string>();

    public int      SortOrder   { get; set; }
    public DateTime CreatedAt   { get; set; }
    public DateTime UpdatedAt   { get; set; }
}
