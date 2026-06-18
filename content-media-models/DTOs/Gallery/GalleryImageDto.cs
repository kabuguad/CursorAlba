using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Content;

// ── Allowed categories (mirror the frontend CATS constant) ────────────────────
// Campus · Classrooms · Sports · Arts · Events · Students

// ── Request DTOs ──────────────────────────────────────────────────────────────

/// <summary>Payload for POST /api/gallery</summary>
public class AddGalleryImageDto
{
    [Required(ErrorMessage = "Image URL is required.")]
    [MaxLength(2048)]
    [Url(ErrorMessage = "Must be a valid URL.")]
    public string Url { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Caption { get; set; }

    /// <summary>
    /// Filter category. Accepted values: Campus · Classrooms · Sports · Arts · Events · Students.
    /// </summary>
    [MaxLength(100)]
    public string? Category { get; set; } = "Campus";

    public bool IsPublic { get; set; } = true;
}

/// <summary>Payload for PUT /api/gallery/{id} — allows updating metadata and sort order.</summary>
public class UpdateGalleryImageDto
{
    [MaxLength(2048)]
    [Url(ErrorMessage = "Must be a valid URL.")]
    public string? Url { get; set; }

    [MaxLength(500)]
    public string? Caption { get; set; }

    [MaxLength(100)]
    public string? Category { get; set; }

    public int? SortOrder { get; set; }

    public bool? IsPublic { get; set; }
}

// ── Response DTO ──────────────────────────────────────────────────────────────

/// <summary>Shape returned by GET /api/gallery and GET /api/gallery/{id}</summary>
public class GalleryImageResponseDto
{
    public int      Id        { get; set; }
    public string   Url       { get; set; } = string.Empty;
    public string?  Caption   { get; set; }
    public string?  Category  { get; set; }
    public int      SortOrder { get; set; }
    public bool     IsPublic  { get; set; }
    public DateTime CreatedAt { get; set; }
}
