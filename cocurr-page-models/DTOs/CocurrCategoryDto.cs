using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Cocurr;

// ── Request DTOs ──────────────────────────────────────────────────────────────

/// <summary>Payload for POST /api/cocurr/categories</summary>
public class CreateCocurrCategoryDto
{
    [MaxLength(10)]
    public string Icon { get; set; } = "⭐";

    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(200, ErrorMessage = "Title must be 200 characters or fewer.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Heading is required.")]
    [MaxLength(300, ErrorMessage = "Heading must be 300 characters or fewer.")]
    public string Heading { get; set; } = string.Empty;

    [Required(ErrorMessage = "Intro text is required.")]
    [MaxLength(1000, ErrorMessage = "Intro must be 1 000 characters or fewer.")]
    public string Intro { get; set; } = string.Empty;

    public int? SortOrder { get; set; }
}

/// <summary>Payload for PUT /api/cocurr/categories/{id}</summary>
public class UpdateCocurrCategoryDto
{
    [MaxLength(10)]
    public string Icon { get; set; } = "⭐";

    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Heading is required.")]
    [MaxLength(300)]
    public string Heading { get; set; } = string.Empty;

    [Required(ErrorMessage = "Intro text is required.")]
    [MaxLength(1000)]
    public string Intro { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}

// ── Response DTO ──────────────────────────────────────────────────────────────

/// <summary>Shape returned by GET /api/cocurr/categories and GET /api/cocurr/categories/{id}</summary>
public class CocurrCategoryResponseDto
{
    public int      Id        { get; set; }
    public string   Icon      { get; set; } = string.Empty;
    public string   Title     { get; set; } = string.Empty;
    public string   Heading   { get; set; } = string.Empty;
    public string   Intro     { get; set; } = string.Empty;
    public int      SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
