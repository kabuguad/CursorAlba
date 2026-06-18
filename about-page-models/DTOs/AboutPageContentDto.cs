using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.About;

// ── Request DTO ───────────────────────────────────────────────────────────────
// No Create DTO — the row is seeded once. Only updates are allowed.

/// <summary>
/// Payload for PUT /api/about/page-content
/// All five fields are required so the admin always submits the full document.
/// </summary>
public class UpdateAboutPageContentDto
{
    [Required(ErrorMessage = "Headline is required.")]
    [MaxLength(300, ErrorMessage = "Headline must be 300 characters or fewer.")]
    public string Headline { get; set; } = string.Empty;

    [Required(ErrorMessage = "Subheadline is required.")]
    [MaxLength(1000, ErrorMessage = "Subheadline must be 1 000 characters or fewer.")]
    public string Subheadline { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mission statement is required.")]
    [MaxLength(2000, ErrorMessage = "Mission must be 2 000 characters or fewer.")]
    public string Mission { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vision statement is required.")]
    [MaxLength(2000, ErrorMessage = "Vision must be 2 000 characters or fewer.")]
    public string Vision { get; set; } = string.Empty;

    [Required(ErrorMessage = "History intro text is required.")]
    [MaxLength(1000, ErrorMessage = "History intro must be 1 000 characters or fewer.")]
    public string HistoryIntro { get; set; } = string.Empty;
}

// ── Response DTO ──────────────────────────────────────────────────────────────

/// <summary>Shape returned by GET /api/about/page-content</summary>
public class AboutPageContentResponseDto
{
    public int      Id           { get; set; }
    public string   Headline     { get; set; } = string.Empty;
    public string   Subheadline  { get; set; } = string.Empty;
    public string   Mission      { get; set; } = string.Empty;
    public string   Vision       { get; set; } = string.Empty;
    public string   HistoryIntro { get; set; } = string.Empty;
    public DateTime UpdatedAt    { get; set; }
}
