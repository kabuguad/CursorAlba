using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Cocurr;

// ── Request DTO ───────────────────────────────────────────────────────────────
// No Create DTO — the singleton row is seeded once. Only updates are allowed.

/// <summary>Payload for PUT /api/cocurr/page-content</summary>
public class UpdateCocurrPageContentDto
{
    [Required(ErrorMessage = "Headline is required.")]
    [MaxLength(300, ErrorMessage = "Headline must be 300 characters or fewer.")]
    public string Headline { get; set; } = string.Empty;

    [Required(ErrorMessage = "Subheadline is required.")]
    [MaxLength(1000, ErrorMessage = "Subheadline must be 1 000 characters or fewer.")]
    public string Subheadline { get; set; } = string.Empty;

    [Required(ErrorMessage = "CTA headline is required.")]
    [MaxLength(200, ErrorMessage = "CTA headline must be 200 characters or fewer.")]
    public string CtaHeadline { get; set; } = string.Empty;

    [Required(ErrorMessage = "CTA subtext is required.")]
    [MaxLength(600, ErrorMessage = "CTA subtext must be 600 characters or fewer.")]
    public string CtaSubtext { get; set; } = string.Empty;
}

// ── Response DTO ──────────────────────────────────────────────────────────────

/// <summary>Shape returned by GET /api/cocurr/page-content</summary>
public class CocurrPageContentResponseDto
{
    public int      Id          { get; set; }
    public string   Headline    { get; set; } = string.Empty;
    public string   Subheadline { get; set; } = string.Empty;
    public string   CtaHeadline { get; set; } = string.Empty;
    public string   CtaSubtext  { get; set; } = string.Empty;
    public DateTime UpdatedAt   { get; set; }
}
