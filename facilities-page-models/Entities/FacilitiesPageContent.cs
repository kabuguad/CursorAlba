using System.ComponentModel.DataAnnotations;

namespace Entities.Models.Facilities;

/// <summary>
/// Singleton row that holds all editable text fields for the public /facilities page.
/// Only one row ever exists (Id = 1). Use UPSERT / EnsureSeeded on startup.
/// Child facility cards are navigated via the <see cref="Facilities"/> collection.
/// </summary>
public class FacilitiesPageContent
{
    [Key]
    public int Id { get; set; } = 1;

    // ── Hero section ──────────────────────────────────────────────────────────

    /// <summary>Main page heading — e.g. "Facilities"</summary>
    [Required, MaxLength(300)]
    public string Headline { get; set; } = string.Empty;

    /// <summary>Paragraph shown directly below the heading.</summary>
    [Required, MaxLength(1000)]
    public string Subheadline { get; set; } = string.Empty;

    // ── Call-to-Action box (bottom of page) ───────────────────────────────────

    /// <summary>Heading inside the campus-tour CTA card — e.g. "Experience It In Person"</summary>
    [Required, MaxLength(200)]
    public string CtaHeadline { get; set; } = string.Empty;

    /// <summary>Body text inside the campus-tour CTA card.</summary>
    [Required, MaxLength(600)]
    public string CtaSubtext { get; set; } = string.Empty;

    // ── Audit ─────────────────────────────────────────────────────────────────

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Navigation (one-to-many) ──────────────────────────────────────────────

    /// <summary>
    /// The ordered list of facility cards that belong to this page.
    /// Loaded via EF Core Include() when needed.
    /// </summary>
    public ICollection<Facility> Facilities { get; set; } = new List<Facility>();
}
