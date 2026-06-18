using System.ComponentModel.DataAnnotations;

namespace Entities.Models.Academics;

/// <summary>
/// Singleton row that holds the editable text fields for the public /academics page.
/// Only one row ever exists (Id = 1). Child school levels are navigated via
/// the <see cref="Levels"/> collection.
/// </summary>
public class AcademicsPageContent
{
    [Key]
    public int Id { get; set; } = 1;

    // ── Hero section ──────────────────────────────────────────────────────────

    /// <summary>Main page heading — e.g. "Programs &amp; Academics"</summary>
    [Required, MaxLength(300)]
    public string Headline { get; set; } = string.Empty;

    /// <summary>Paragraph shown directly below the heading.</summary>
    [Required, MaxLength(1000)]
    public string Subheadline { get; set; } = string.Empty;

    // ── Call-to-Action box (bottom of page) ───────────────────────────────────

    /// <summary>Heading inside the enrolment CTA card — e.g. "Ready to Enrol?"</summary>
    [Required, MaxLength(200)]
    public string CtaHeadline { get; set; } = string.Empty;

    /// <summary>Body text inside the enrolment CTA card.</summary>
    [Required, MaxLength(600)]
    public string CtaSubtext { get; set; } = string.Empty;

    // ── Audit ─────────────────────────────────────────────────────────────────

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Navigation (one-to-many) ──────────────────────────────────────────────

    /// <summary>
    /// The ordered list of school levels (Playgroup → Senior School) that belong
    /// to this page. Loaded via EF Core Include() when needed.
    /// </summary>
    public ICollection<SchoolLevel> Levels { get; set; } = new List<SchoolLevel>();
}
