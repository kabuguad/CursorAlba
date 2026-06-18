using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models.Academics;

/// <summary>
/// A single school-level tab in the "School Structure" selector on the
/// /academics page (e.g. Playgroup, ECDE, Lower Primary … Senior School).
/// Child of <see cref="AcademicsPageContent"/> via a one-to-many relationship.
/// </summary>
public class SchoolLevel
{
    [Key]
    public int Id { get; set; }

    // ── Relationship ──────────────────────────────────────────────────────────

    /// <summary>FK to the parent AcademicsPageContent singleton (always 1).</summary>
    public int AcademicsPageContentId { get; set; }

    [ForeignKey(nameof(AcademicsPageContentId))]
    public AcademicsPageContent AcademicsPageContent { get; set; } = null!;

    // ── Identity fields ───────────────────────────────────────────────────────

    /// <summary>
    /// URL-friendly identifier used as the tab key — e.g. "playgroup",
    /// "lower-primary", "junior". Must be unique.
    /// </summary>
    [Required, MaxLength(100)]
    public string Slug { get; set; } = string.Empty;

    /// <summary>Display name shown on the tab — e.g. "Lower Primary".</summary>
    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    // ── Descriptive fields ────────────────────────────────────────────────────

    /// <summary>
    /// Age or grade range shown as a subtitle — e.g. "Grades 7 – 9 · Ages 12 – 14".
    /// </summary>
    [MaxLength(100)]
    public string Ages { get; set; } = string.Empty;

    /// <summary>
    /// Emoji or symbol displayed on the card icon — e.g. "📚", "🎓".
    /// </summary>
    [Required, MaxLength(10)]
    public string Icon { get; set; } = "📚";

    /// <summary>
    /// Colour theme key for the card gradient.
    /// Accepted values: pink · green · blue · violet · amber · teal · gold · purple · red · slate
    /// </summary>
    [Required, MaxLength(20)]
    public string ColorKey { get; set; } = "blue";

    /// <summary>One to three sentences describing the level.</summary>
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Newline-delimited list of learning areas / subjects offered at this level.
    /// e.g. "English\nKiswahili\nMathematics\nIntegrated Science"
    /// Split on '\n' in the API response to return a <c>string[]</c>.
    /// </summary>
    public string Highlights { get; set; } = string.Empty;

    /// <summary>Controls the display order of the tabs. Lower = earlier.</summary>
    public int SortOrder { get; set; } = 0;

    // ── Audit ─────────────────────────────────────────────────────────────────

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
