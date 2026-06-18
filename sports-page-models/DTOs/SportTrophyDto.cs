using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Sports;

/// <summary>Payload for POST /api/sports/trophies</summary>
public class CreateSportTrophyDto
{
    [Required(ErrorMessage = "Year is required.")]
    [MaxLength(10, ErrorMessage = "Year must be 10 characters or fewer.")]
    public string Year { get; set; } = string.Empty;

    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(300, ErrorMessage = "Title must be 300 characters or fewer.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Category is required.")]
    [MaxLength(150, ErrorMessage = "Category must be 150 characters or fewer.")]
    public string Category { get; set; } = string.Empty;

    public int? SortOrder { get; set; }
}

/// <summary>Payload for PUT /api/sports/trophies/{id}</summary>
public class UpdateSportTrophyDto
{
    [Required(ErrorMessage = "Year is required.")]
    [MaxLength(10)]
    public string Year { get; set; } = string.Empty;

    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Category is required.")]
    [MaxLength(150)]
    public string Category { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}

/// <summary>Shape returned by GET /api/sports/trophies and GET /api/sports/trophies/{id}</summary>
public class SportTrophyResponseDto
{
    public int      Id        { get; set; }
    public string   Year      { get; set; } = string.Empty;
    public string   Title     { get; set; } = string.Empty;
    public string   Category  { get; set; } = string.Empty;
    public int      SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
