using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Drama;

/// <summary>Payload for POST /api/drama/dance-styles</summary>
public class CreateDanceStyleDto
{
    [Required(ErrorMessage = "Style name is required.")]
    [MaxLength(150, ErrorMessage = "Style must be 150 characters or fewer.")]
    public string Style { get; set; } = string.Empty;

    [MaxLength(10)]
    public string Icon { get; set; } = "💃";

    [Required(ErrorMessage = "Description is required.")]
    [MaxLength(600, ErrorMessage = "Description must be 600 characters or fewer.")]
    public string Desc { get; set; } = string.Empty;

    public int? SortOrder { get; set; }
}

/// <summary>Payload for PUT /api/drama/dance-styles/{id}</summary>
public class UpdateDanceStyleDto
{
    [Required(ErrorMessage = "Style name is required.")]
    [MaxLength(150)]
    public string Style { get; set; } = string.Empty;

    [MaxLength(10)]
    public string Icon { get; set; } = "💃";

    [Required(ErrorMessage = "Description is required.")]
    [MaxLength(600)]
    public string Desc { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}

/// <summary>Shape returned by GET /api/drama/dance-styles and GET /api/drama/dance-styles/{id}</summary>
public class DanceStyleResponseDto
{
    public int      Id        { get; set; }
    public string   Style     { get; set; } = string.Empty;
    public string   Icon      { get; set; } = string.Empty;
    public string   Desc      { get; set; } = string.Empty;
    public int      SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
