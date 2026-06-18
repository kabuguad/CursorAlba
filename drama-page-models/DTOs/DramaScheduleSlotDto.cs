using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Drama;

/// <summary>Payload for POST /api/drama/schedule</summary>
public class CreateDramaScheduleSlotDto
{
    [Required(ErrorMessage = "Day is required.")]
    [MaxLength(20, ErrorMessage = "Day must be 20 characters or fewer.")]
    public string Day { get; set; } = string.Empty;

    [Required(ErrorMessage = "Activity is required.")]
    [MaxLength(300, ErrorMessage = "Activity must be 300 characters or fewer.")]
    public string Activity { get; set; } = string.Empty;

    public int? SortOrder { get; set; }
}

/// <summary>Payload for PUT /api/drama/schedule/{id}</summary>
public class UpdateDramaScheduleSlotDto
{
    [Required(ErrorMessage = "Day is required.")]
    [MaxLength(20)]
    public string Day { get; set; } = string.Empty;

    [Required(ErrorMessage = "Activity is required.")]
    [MaxLength(300)]
    public string Activity { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}

/// <summary>Shape returned by GET /api/drama/schedule and GET /api/drama/schedule/{id}</summary>
public class DramaScheduleSlotResponseDto
{
    public int      Id        { get; set; }
    public string   Day       { get; set; } = string.Empty;
    public string   Activity  { get; set; } = string.Empty;
    public int      SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
