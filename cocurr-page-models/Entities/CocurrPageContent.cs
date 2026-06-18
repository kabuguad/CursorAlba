using System.ComponentModel.DataAnnotations;

namespace Entities.Models.Cocurr;

/// <summary>
/// Singleton row that holds all editable text fields for the public /co-curricular page.
/// Only one row ever exists (Id = 1). Use UPSERT / EnsureSeeded on startup.
/// Child categories are navigated via the <see cref="Categories"/> collection.
/// </summary>
public class CocurrPageContent
{
    [Key]
    public int Id { get; set; } = 1;

    // ── Hero section ──────────────────────────────────────────────────────────

    /// <summary>Main page heading — e.g. "Co-Curricular"</summary>
    [Required, MaxLength(300)]
    public string Headline { get; set; } = string.Empty;

    /// <summary>Paragraph shown directly below the heading.</summary>
    [Required, MaxLength(1000)]
    public string Subheadline { get; set; } = string.Empty;

    // ── Call-to-Action box (bottom of page) ───────────────────────────────────

    /// <summary>Heading inside the CTA card — e.g. "Enrich Your Child's Journey"</summary>
    [Required, MaxLength(200)]
    public string CtaHeadline { get; set; } = string.Empty;

    /// <summary>Body text inside the CTA card.</summary>
    [Required, MaxLength(600)]
    public string CtaSubtext { get; set; } = string.Empty;

    // ── Audit ─────────────────────────────────────────────────────────────────

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Navigation (one-to-many) ──────────────────────────────────────────────

    /// <summary>
    /// The four co-curricular category panels (Sports, Arts, Community, CTS).
    /// Loaded via EF Core Include() when needed.
    /// </summary>
    public ICollection<CocurrCategory> Categories { get; set; } = new List<CocurrCategory>();
}
