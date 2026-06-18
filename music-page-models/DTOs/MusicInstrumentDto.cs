using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Music;

/// <summary>Payload for POST /api/music/instruments</summary>
public class CreateMusicInstrumentDto
{
    [MaxLength(10)]
    public string Icon { get; set; } = "🎵";

    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(150, ErrorMessage = "Name must be 150 characters or fewer.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required.")]
    [MaxLength(600, ErrorMessage = "Description must be 600 characters or fewer.")]
    public string Desc { get; set; } = string.Empty;

    public int? SortOrder { get; set; }
}

/// <summary>Payload for PUT /api/music/instruments/{id}</summary>
public class UpdateMusicInstrumentDto
{
    [MaxLength(10)]
    public string Icon { get; set; } = "🎵";

    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required.")]
    [MaxLength(600)]
    public string Desc { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}

/// <summary>Shape returned by GET /api/music/instruments and GET /api/music/instruments/{id}</summary>
public class MusicInstrumentResponseDto
{
    public int      Id        { get; set; }
    public string   Icon      { get; set; } = string.Empty;
    public string   Name      { get; set; } = string.Empty;
    public string   Desc      { get; set; } = string.Empty;
    public int      SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
