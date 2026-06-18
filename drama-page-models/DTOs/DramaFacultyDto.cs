using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Drama;

/// <summary>Payload for POST /api/drama/faculty</summary>
public class CreateDramaFacultyDto
{
    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(200, ErrorMessage = "Name must be 200 characters or fewer.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Role is required.")]
    [MaxLength(300, ErrorMessage = "Role must be 300 characters or fewer.")]
    public string Role { get; set; } = string.Empty;

    [MaxLength(2048, ErrorMessage = "Image URL must be 2 048 characters or fewer.")]
    public string Img { get; set; } = string.Empty;

    [MaxLength(600, ErrorMessage = "Bio must be 600 characters or fewer.")]
    public string Bio { get; set; } = string.Empty;

    public int? SortOrder { get; set; }
}

/// <summary>Payload for PUT /api/drama/faculty/{id}</summary>
public class UpdateDramaFacultyDto
{
    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Role is required.")]
    [MaxLength(300)]
    public string Role { get; set; } = string.Empty;

    [MaxLength(2048)]
    public string Img { get; set; } = string.Empty;

    [MaxLength(600)]
    public string Bio { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}

/// <summary>Shape returned by GET /api/drama/faculty and GET /api/drama/faculty/{id}</summary>
public class DramaFacultyResponseDto
{
    public int      Id        { get; set; }
    public string   Name      { get; set; } = string.Empty;
    public string   Role      { get; set; } = string.Empty;
    public string   Img       { get; set; } = string.Empty;
    public string   Bio       { get; set; } = string.Empty;
    public int      SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
