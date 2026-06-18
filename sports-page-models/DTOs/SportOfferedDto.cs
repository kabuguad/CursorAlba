using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Sports;

/// <summary>Payload for POST /api/sports/offered</summary>
public class CreateSportOfferedDto
{
    [MaxLength(10)]
    public string Icon { get; set; } = "🏅";

    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(150, ErrorMessage = "Name must be 150 characters or fewer.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required.")]
    [MaxLength(600, ErrorMessage = "Description must be 600 characters or fewer.")]
    public string Desc { get; set; } = string.Empty;

    public int? SortOrder { get; set; }
}

/// <summary>Payload for PUT /api/sports/offered/{id}</summary>
public class UpdateSportOfferedDto
{
    [MaxLength(10)]
    public string Icon { get; set; } = "🏅";

    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required.")]
    [MaxLength(600)]
    public string Desc { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}

/// <summary>Shape returned by GET /api/sports/offered and GET /api/sports/offered/{id}</summary>
public class SportOfferedResponseDto
{
    public int      Id        { get; set; }
    public string   Icon      { get; set; } = string.Empty;
    public string   Name      { get; set; } = string.Empty;
    public string   Desc      { get; set; } = string.Empty;
    public int      SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
