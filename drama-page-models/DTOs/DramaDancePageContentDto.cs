using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Drama;

// No Create DTO — the singleton row is seeded once. Only updates are allowed.

/// <summary>Payload for PUT /api/drama/page-content</summary>
public class UpdateDramaDancePageContentDto
{
    [Required(ErrorMessage = "Headline is required.")]
    [MaxLength(300, ErrorMessage = "Headline must be 300 characters or fewer.")]
    public string Headline { get; set; } = string.Empty;

    [Required(ErrorMessage = "Subheadline is required.")]
    [MaxLength(1000, ErrorMessage = "Subheadline must be 1 000 characters or fewer.")]
    public string Subheadline { get; set; } = string.Empty;
}

/// <summary>Shape returned by GET /api/drama/page-content</summary>
public class DramaDancePageContentResponseDto
{
    public int      Id          { get; set; }
    public string   Headline    { get; set; } = string.Empty;
    public string   Subheadline { get; set; } = string.Empty;
    public DateTime UpdatedAt   { get; set; }
}
