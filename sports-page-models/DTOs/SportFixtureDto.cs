using System.ComponentModel.DataAnnotations;
using Entities.Models.Sports;

namespace AlbaApi.Presentation.DTOs.Sports;

/// <summary>Payload for POST /api/sports/fixtures</summary>
public class CreateSportFixtureDto
{
    [Required(ErrorMessage = "Sport is required.")]
    [MaxLength(150, ErrorMessage = "Sport must be 150 characters or fewer.")]
    public string Sport { get; set; } = string.Empty;

    [Required(ErrorMessage = "Opponent is required.")]
    [MaxLength(300, ErrorMessage = "Opponent must be 300 characters or fewer.")]
    public string Opponent { get; set; } = string.Empty;

    /// <summary>ISO 8601 date string — e.g. "2026-03-20".</summary>
    [Required(ErrorMessage = "Date is required.")]
    [MaxLength(20)]
    public string Date { get; set; } = string.Empty;

    [Required(ErrorMessage = "Venue is required.")]
    [MaxLength(300, ErrorMessage = "Venue must be 300 characters or fewer.")]
    public string Venue { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Result { get; set; } = "—";

    public FixtureStatus Status { get; set; } = FixtureStatus.Upcoming;
}

/// <summary>Payload for PUT /api/sports/fixtures/{id}</summary>
public class UpdateSportFixtureDto
{
    [Required(ErrorMessage = "Sport is required.")]
    [MaxLength(150)]
    public string Sport { get; set; } = string.Empty;

    [Required(ErrorMessage = "Opponent is required.")]
    [MaxLength(300)]
    public string Opponent { get; set; } = string.Empty;

    [Required(ErrorMessage = "Date is required.")]
    [MaxLength(20)]
    public string Date { get; set; } = string.Empty;

    [Required(ErrorMessage = "Venue is required.")]
    [MaxLength(300)]
    public string Venue { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Result { get; set; } = "—";

    public FixtureStatus Status { get; set; } = FixtureStatus.Upcoming;
}

/// <summary>
/// Shape returned by GET /api/sports/fixtures and GET /api/sports/fixtures/{id}.
/// <c>Status</c> is returned as a lowercase string ("upcoming" | "live" | "completed")
/// to match the frontend badge logic.
/// </summary>
public class SportFixtureResponseDto
{
    public int      Id       { get; set; }
    public string   Sport    { get; set; } = string.Empty;
    public string   Opponent { get; set; } = string.Empty;
    public string   Date     { get; set; } = string.Empty;
    public string   Venue    { get; set; } = string.Empty;
    public string   Result   { get; set; } = string.Empty;

    /// <summary>Lowercase status string — "upcoming" | "live" | "completed".</summary>
    public string   Status   { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
