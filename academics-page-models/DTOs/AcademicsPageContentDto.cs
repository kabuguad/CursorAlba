using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Academics;

// ── Request DTO ───────────────────────────────────────────────────────────────
// No Create DTO — the row is seeded once. Only updates are allowed.

/// <summary>
/// Payload for PUT /api/academics/page-content
/// Updates the four editable text fields on the Academics page.
/// School levels are managed separately via /api/academics/levels.
/// </summary>
public class UpdateAcademicsPageContentDto
{
    [Required(ErrorMessage = "Headline is required.")]
    [MaxLength(300)]
    public string Headline { get; set; } = string.Empty;

    [Required(ErrorMessage = "Subheadline is required.")]
    [MaxLength(1000)]
    public string Subheadline { get; set; } = string.Empty;

    [Required(ErrorMessage = "CTA headline is required.")]
    [MaxLength(200)]
    public string CtaHeadline { get; set; } = string.Empty;

    [Required(ErrorMessage = "CTA subtext is required.")]
    [MaxLength(600)]
    public string CtaSubtext { get; set; } = string.Empty;
}

// ── Response DTO ──────────────────────────────────────────────────────────────

/// <summary>
/// Shape returned by GET /api/academics/page-content
/// Includes the child school levels inline for the public page.
/// </summary>
public class AcademicsPageContentResponseDto
{
    public int                        Id          { get; set; }
    public string                     Headline    { get; set; } = string.Empty;
    public string                     Subheadline { get; set; } = string.Empty;
    public string                     CtaHeadline { get; set; } = string.Empty;
    public string                     CtaSubtext  { get; set; } = string.Empty;
    public DateTime                   UpdatedAt   { get; set; }

    /// <summary>
    /// Ordered list of school levels — populated via EF Core Include().
    /// Returned inline so the public page can load everything in one request.
    /// </summary>
    public List<SchoolLevelResponseDto> Levels    { get; set; } = new();
}
