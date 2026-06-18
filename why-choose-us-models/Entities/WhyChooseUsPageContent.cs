using System.ComponentModel.DataAnnotations;

namespace Entities.Models.WhyChooseUs;

/// <summary>
/// Singleton row holding all editable text fields for the public /why-choose-us page.
/// Only one row ever exists (Id = 1). Child reason cards are navigated via
/// the <see cref="Items"/> collection.
/// </summary>
public class WhyChooseUsPageContent
{
    [Key]
    public int Id { get; set; } = 1;

    // ── Hero section ──────────────────────────────────────────────────────────

    /// <summary>
    /// Small pill label shown above the main heading — e.g. "The Alber Difference".
    /// </summary>
    [Required, MaxLength(100)]
    public string Tagline { get; set; } = string.Empty;

    /// <summary>Main page heading — e.g. "Why Choose Us?"</summary>
    [Required, MaxLength(300)]
    public string Headline { get; set; } = string.Empty;

    /// <summary>Paragraph shown directly below the heading.</summary>
    [Required, MaxLength(1000)]
    public string Subheadline { get; set; } = string.Empty;

    // ── Stats bar (four KPI tiles) ────────────────────────────────────────────

    /// <summary>Stat tile 1 — e.g. "2,000+"</summary>
    [Required, MaxLength(30)]
    public string StatStudents { get; set; } = string.Empty;

    /// <summary>Stat tile 2 — e.g. "120+"</summary>
    [Required, MaxLength(30)]
    public string StatEducators { get; set; } = string.Empty;

    /// <summary>Stat tile 3 — e.g. "97%"</summary>
    [Required, MaxLength(30)]
    public string StatPassRate { get; set; } = string.Empty;

    /// <summary>Stat tile 4 — e.g. "30+"</summary>
    [Required, MaxLength(30)]
    public string StatActivities { get; set; } = string.Empty;

    // ── Call-to-Action box (bottom of page) ───────────────────────────────────

    /// <summary>Heading inside the CTA card — e.g. "Ready to Experience It?"</summary>
    [Required, MaxLength(200)]
    public string CtaHeadline { get; set; } = string.Empty;

    /// <summary>Body text inside the CTA card.</summary>
    [Required, MaxLength(600)]
    public string CtaSubtext { get; set; } = string.Empty;

    // ── Audit ─────────────────────────────────────────────────────────────────

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Navigation (one-to-many) ──────────────────────────────────────────────

    /// <summary>
    /// The ordered list of "Alber Difference" reason cards that belong to this page.
    /// Load via EF Core <c>Include(w =&gt; w.Items)</c> when serving the public page.
    /// </summary>
    public ICollection<WhyChooseUsItem> Items { get; set; } = new List<WhyChooseUsItem>();
}
