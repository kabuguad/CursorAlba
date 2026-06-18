using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Facilities;

// ── Request DTOs ──────────────────────────────────────────────────────────────

/// <summary>Payload for POST /api/facilities</summary>
public class CreateFacilityDto
{
    /// <summary>Emoji icon — e.g. "🖥️". Defaults to 🏫 if omitted.</summary>
    [MaxLength(10)]
    public string Icon { get; set; } = "🏫";

    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(200, ErrorMessage = "Name must be 200 characters or fewer.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required.")]
    [MaxLength(1000, ErrorMessage = "Description must be 1 000 characters or fewer.")]
    public string Desc { get; set; } = string.Empty;

    /// <summary>Absolute URL to the facility image. May be empty.</summary>
    [MaxLength(2048, ErrorMessage = "Image URL must be 2 048 characters or fewer.")]
    public string Img { get; set; } = string.Empty;

    /// <summary>
    /// Newline-separated (\n) feature badges — e.g.
    /// "Interactive whiteboards\nHigh-speed fibre internet\nAir-conditioned".
    /// Each line becomes one pill badge in the UI.
    /// </summary>
    [MaxLength(2000, ErrorMessage = "Highlights must be 2 000 characters or fewer.")]
    public string Highlights { get; set; } = string.Empty;

    /// <summary>
    /// Display position in the grid. When omitted the service appends the item
    /// at the end (max existing sort order + 1).
    /// </summary>
    public int? SortOrder { get; set; }

    public bool IsPublished { get; set; } = true;
}

/// <summary>Payload for PUT /api/facilities/{id}</summary>
public class UpdateFacilityDto
{
    [MaxLength(10)]
    public string Icon { get; set; } = "🏫";

    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required.")]
    [MaxLength(1000)]
    public string Desc { get; set; } = string.Empty;

    [MaxLength(2048)]
    public string Img { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Highlights { get; set; } = string.Empty;

    public int  SortOrder   { get; set; }
    public bool IsPublished { get; set; } = true;
}

// ── Response DTO ──────────────────────────────────────────────────────────────

/// <summary>
/// Shape returned by GET /api/facilities and GET /api/facilities/{id}.
/// <c>Highlights</c> is kept as the raw newline-separated string;
/// the client splits on '\n' and trims each entry before rendering pill badges.
/// </summary>
public class FacilityResponseDto
{
    public int      Id          { get; set; }
    public string   Icon        { get; set; } = string.Empty;
    public string   Name        { get; set; } = string.Empty;
    public string   Desc        { get; set; } = string.Empty;
    public string   Img         { get; set; } = string.Empty;
    public string   Highlights  { get; set; } = string.Empty;
    public int      SortOrder   { get; set; }
    public bool     IsPublished { get; set; }
    public DateTime CreatedAt   { get; set; }
    public DateTime UpdatedAt   { get; set; }
}
