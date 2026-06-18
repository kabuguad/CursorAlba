using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.WhyChooseUs;

// ── Request DTO ───────────────────────────────────────────────────────────────
// No Create DTO — the row is seeded once. Only updates are allowed.

/// <summary>
/// Payload for PUT /api/why-choose-us/page-content
/// Updates the nine editable text fields on the Why Choose Us page.
/// Reason cards are managed separately via /api/why-choose-us/items.
/// </summary>
public class UpdateWhyChooseUsPageContentDto
{
    [Required(ErrorMessage = "Tagline is required.")]
    [MaxLength(100)]
    public string Tagline { get; set; } = string.Empty;

    [Required(ErrorMessage = "Headline is required.")]
    [MaxLength(300)]
    public string Headline { get; set; } = string.Empty;

    [Required(ErrorMessage = "Subheadline is required.")]
    [MaxLength(1000)]
    public string Subheadline { get; set; } = string.Empty;

    [Required(ErrorMessage = "Students stat is required.")]
    [MaxLength(30)]
    public string StatStudents { get; set; } = string.Empty;

    [Required(ErrorMessage = "Educators stat is required.")]
    [MaxLength(30)]
    public string StatEducators { get; set; } = string.Empty;

    [Required(ErrorMessage = "Pass rate stat is required.")]
    [MaxLength(30)]
    public string StatPassRate { get; set; } = string.Empty;

    [Required(ErrorMessage = "Activities stat is required.")]
    [MaxLength(30)]
    public string StatActivities { get; set; } = string.Empty;

    [Required(ErrorMessage = "CTA headline is required.")]
    [MaxLength(200)]
    public string CtaHeadline { get; set; } = string.Empty;

    [Required(ErrorMessage = "CTA subtext is required.")]
    [MaxLength(600)]
    public string CtaSubtext { get; set; } = string.Empty;
}

// ── Response DTO ──────────────────────────────────────────────────────────────

/// <summary>
/// Shape returned by GET /api/why-choose-us/page-content
/// Includes only published child items inline for the public page.
/// The admin list endpoint should include all items regardless of IsPublished.
/// </summary>
public class WhyChooseUsPageContentResponseDto
{
    public int      Id             { get; set; }
    public string   Tagline        { get; set; } = string.Empty;
    public string   Headline       { get; set; } = string.Empty;
    public string   Subheadline    { get; set; } = string.Empty;
    public string   StatStudents   { get; set; } = string.Empty;
    public string   StatEducators  { get; set; } = string.Empty;
    public string   StatPassRate   { get; set; } = string.Empty;
    public string   StatActivities { get; set; } = string.Empty;
    public string   CtaHeadline    { get; set; } = string.Empty;
    public string   CtaSubtext     { get; set; } = string.Empty;
    public DateTime UpdatedAt      { get; set; }

    /// <summary>
    /// Published reason cards ordered by SortOrder.
    /// Populated via <c>Include(w =&gt; w.Items).Where(i =&gt; i.IsPublished)</c>.
    /// </summary>
    public List<WhyChooseUsItemResponseDto> Items { get; set; } = new();
}
