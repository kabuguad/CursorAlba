using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Music;

// No Create DTO — the singleton row is seeded once. Only updates are allowed.

/// <summary>Payload for PUT /api/music/page-content</summary>
public class UpdateMusicPageContentDto
{
    [Required(ErrorMessage = "Headline is required.")]
    [MaxLength(300, ErrorMessage = "Headline must be 300 characters or fewer.")]
    public string Headline { get; set; } = string.Empty;

    [Required(ErrorMessage = "Subheadline is required.")]
    [MaxLength(1000, ErrorMessage = "Subheadline must be 1 000 characters or fewer.")]
    public string Subheadline { get; set; } = string.Empty;
}

/// <summary>Shape returned by GET /api/music/page-content</summary>
public class MusicPageContentResponseDto
{
    public int      Id          { get; set; }
    public string   Headline    { get; set; } = string.Empty;
    public string   Subheadline { get; set; } = string.Empty;
    public DateTime UpdatedAt   { get; set; }
}
