using System.ComponentModel.DataAnnotations;

namespace Entities.Models.About;

/// <summary>
/// Singleton row that holds all editable text fields for the public /about page.
/// Only one row ever exists (Id = 1). Use UPSERT / EnsureSeeded on startup.
/// </summary>
public class AboutPageContent
{
    [Key]
    public int Id { get; set; } = 1;

    // ── Hero section ──────────────────────────────────────────────────────────

    /// <summary>Main page heading — e.g. "About Us"</summary>
    [Required, MaxLength(300)]
    public string Headline { get; set; } = string.Empty;

    /// <summary>Paragraph shown directly below the heading.</summary>
    [Required, MaxLength(1000)]
    public string Subheadline { get; set; } = string.Empty;

    // ── Mission & Vision cards ────────────────────────────────────────────────

    /// <summary>Full mission statement displayed in the Mission card.</summary>
    [Required, MaxLength(2000)]
    public string Mission { get; set; } = string.Empty;

    /// <summary>Full vision statement displayed in the Vision card.</summary>
    [Required, MaxLength(2000)]
    public string Vision { get; set; } = string.Empty;

    // ── Our History section ───────────────────────────────────────────────────

    /// <summary>
    /// Introductory paragraph shown above the history timeline.
    /// e.g. "Two decades of excellence — from a single campus in Kutus…"
    /// </summary>
    [Required, MaxLength(1000)]
    public string HistoryIntro { get; set; } = string.Empty;

    // ── Audit ─────────────────────────────────────────────────────────────────

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
