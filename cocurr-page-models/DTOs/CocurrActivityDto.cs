using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Cocurr;

// ── Request DTOs ──────────────────────────────────────────────────────────────

/// <summary>Payload for POST /api/cocurr/categories/{categoryId}/activities</summary>
public class CreateCocurrActivityDto
{
    [MaxLength(10)]
    public string Icon { get; set; } = "⭐";

    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(200, ErrorMessage = "Name must be 200 characters or fewer.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required.")]
    [MaxLength(600, ErrorMessage = "Description must be 600 characters or fewer.")]
    public string Desc { get; set; } = string.Empty;

    /// <summary>When omitted the service appends the item at the end of the category.</summary>
    public int? SortOrder { get; set; }
}

/// <summary>Payload for PUT /api/cocurr/activities/{id}</summary>
public class UpdateCocurrActivityDto
{
    [MaxLength(10)]
    public string Icon { get; set; } = "⭐";

    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required.")]
    [MaxLength(600)]
    public string Desc { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}

// ── Response DTO ──────────────────────────────────────────────────────────────

/// <summary>
/// Shape returned by GET /api/cocurr/categories/{categoryId}/activities
/// and GET /api/cocurr/activities/{id}.
/// </summary>
public class CocurrActivityResponseDto
{
    public int      Id               { get; set; }
    public string   Icon             { get; set; } = string.Empty;
    public string   Name             { get; set; } = string.Empty;
    public string   Desc             { get; set; } = string.Empty;
    public int      SortOrder        { get; set; }
    public int      CocurrCategoryId { get; set; }
    public DateTime CreatedAt        { get; set; }
    public DateTime UpdatedAt        { get; set; }
}
