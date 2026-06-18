using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Music;

/// <summary>Payload for POST /api/music/schedule</summary>
public class CreateMusicScheduleSlotDto
{
    [Required(ErrorMessage = "Day is required.")]
    [MaxLength(20, ErrorMessage = "Day must be 20 characters or fewer.")]
    public string Day { get; set; } = string.Empty;

    /// <summary>
    /// Newline-separated (\n) session strings — e.g.
    /// "Piano — 3:30–5:00 PM\nChoir Rehearsal — 4:00–5:30 PM".
    /// </summary>
    [Required(ErrorMessage = "Slots are required.")]
    [MaxLength(1000, ErrorMessage = "Slots must be 1 000 characters or fewer.")]
    public string Slots { get; set; } = string.Empty;

    public int? SortOrder { get; set; }
}

/// <summary>Payload for PUT /api/music/schedule/{id}</summary>
public class UpdateMusicScheduleSlotDto
{
    [Required(ErrorMessage = "Day is required.")]
    [MaxLength(20)]
    public string Day { get; set; } = string.Empty;

    [Required(ErrorMessage = "Slots are required.")]
    [MaxLength(1000)]
    public string Slots { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}

/// <summary>
/// Shape returned by GET /api/music/schedule and GET /api/music/schedule/{id}.
/// <c>Slots</c> is the raw newline-separated string; split on '\n' before rendering list items.
/// </summary>
public class MusicScheduleSlotResponseDto
{
    public int      Id        { get; set; }
    public string   Day       { get; set; } = string.Empty;
    public string   Slots     { get; set; } = string.Empty;
    public int      SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
