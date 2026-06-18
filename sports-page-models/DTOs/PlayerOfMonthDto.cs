using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Sports;

/// <summary>
/// Payload for POST /api/sports/player-of-month.
/// The service sets IsActive = true on the new record and flips all others to false.
/// </summary>
public class CreatePlayerOfMonthDto
{
    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(200, ErrorMessage = "Name must be 200 characters or fewer.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Sport is required.")]
    [MaxLength(150, ErrorMessage = "Sport must be 150 characters or fewer.")]
    public string Sport { get; set; } = string.Empty;

    [Required(ErrorMessage = "Class is required.")]
    [MaxLength(100, ErrorMessage = "Class must be 100 characters or fewer.")]
    public string Class { get; set; } = string.Empty;

    [MaxLength(2048, ErrorMessage = "Image URL must be 2 048 characters or fewer.")]
    public string Image { get; set; } = string.Empty;

    [MaxLength(300, ErrorMessage = "Stats must be 300 characters or fewer.")]
    public string Stats { get; set; } = string.Empty;
}

/// <summary>Payload for PUT /api/sports/player-of-month/{id}</summary>
public class UpdatePlayerOfMonthDto
{
    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Sport is required.")]
    [MaxLength(150)]
    public string Sport { get; set; } = string.Empty;

    [Required(ErrorMessage = "Class is required.")]
    [MaxLength(100)]
    public string Class { get; set; } = string.Empty;

    [MaxLength(2048)]
    public string Image { get; set; } = string.Empty;

    [MaxLength(300)]
    public string Stats { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
}

/// <summary>
/// Shape returned by GET /api/sports/player-of-month/active
/// and GET /api/sports/player-of-month/{id}.
/// </summary>
public class PlayerOfMonthResponseDto
{
    public int      Id        { get; set; }
    public string   Name      { get; set; } = string.Empty;
    public string   Sport     { get; set; } = string.Empty;
    public string   Class     { get; set; } = string.Empty;
    public string   Image     { get; set; } = string.Empty;
    public string   Stats     { get; set; } = string.Empty;
    public bool     IsActive  { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
