using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Drama;

/// <summary>Payload for POST /api/drama/plays</summary>
public class CreateDramaPlayDto
{
    [Required(ErrorMessage = "Year is required.")]
    [MaxLength(10, ErrorMessage = "Year must be 10 characters or fewer.")]
    public string Year { get; set; } = string.Empty;

    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(300, ErrorMessage = "Title must be 300 characters or fewer.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required.")]
    [MaxLength(600, ErrorMessage = "Description must be 600 characters or fewer.")]
    public string Desc { get; set; } = string.Empty;

    [MaxLength(2048, ErrorMessage = "Image URL must be 2 048 characters or fewer.")]
    public string Img { get; set; } = string.Empty;

    public int? SortOrder { get; set; }
}

/// <summary>Payload for PUT /api/drama/plays/{id}</summary>
public class UpdateDramaPlayDto
{
    [Required(ErrorMessage = "Year is required.")]
    [MaxLength(10)]
    public string Year { get; set; } = string.Empty;

    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required.")]
    [MaxLength(600)]
    public string Desc { get; set; } = string.Empty;

    [MaxLength(2048)]
    public string Img { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}

/// <summary>Shape returned by GET /api/drama/plays and GET /api/drama/plays/{id}</summary>
public class DramaPlayResponseDto
{
    public int      Id        { get; set; }
    public string   Year      { get; set; } = string.Empty;
    public string   Title     { get; set; } = string.Empty;
    public string   Desc      { get; set; } = string.Empty;
    public string   Img       { get; set; } = string.Empty;
    public int      SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
