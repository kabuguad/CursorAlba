using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Music;

/// <summary>Payload for POST /api/music/teachers</summary>
public class CreateMusicTeacherDto
{
    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(200, ErrorMessage = "Name must be 200 characters or fewer.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Subject is required.")]
    [MaxLength(200, ErrorMessage = "Subject must be 200 characters or fewer.")]
    public string Subject { get; set; } = string.Empty;

    [MaxLength(2048, ErrorMessage = "Image URL must be 2 048 characters or fewer.")]
    public string Img { get; set; } = string.Empty;

    [MaxLength(400, ErrorMessage = "Credentials must be 400 characters or fewer.")]
    public string Credentials { get; set; } = string.Empty;

    public int? SortOrder { get; set; }
}

/// <summary>Payload for PUT /api/music/teachers/{id}</summary>
public class UpdateMusicTeacherDto
{
    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Subject is required.")]
    [MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    [MaxLength(2048)]
    public string Img { get; set; } = string.Empty;

    [MaxLength(400)]
    public string Credentials { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}

/// <summary>Shape returned by GET /api/music/teachers and GET /api/music/teachers/{id}</summary>
public class MusicTeacherResponseDto
{
    public int      Id          { get; set; }
    public string   Name        { get; set; } = string.Empty;
    public string   Subject     { get; set; } = string.Empty;
    public string   Img         { get; set; } = string.Empty;
    public string   Credentials { get; set; } = string.Empty;
    public int      SortOrder   { get; set; }
    public DateTime CreatedAt   { get; set; }
    public DateTime UpdatedAt   { get; set; }
}
