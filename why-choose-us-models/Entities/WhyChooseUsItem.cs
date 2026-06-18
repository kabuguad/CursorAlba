using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models.WhyChooseUs;

/// <summary>
/// A single "Alber Difference" reason card shown in the main alternating-layout
/// grid on the /why-choose-us page (e.g. Academic Excellence, World-Class Facilities).
/// Child of <see cref="WhyChooseUsPageContent"/> via a one-to-many relationship.
/// </summary>
public class WhyChooseUsItem
{
    [Key]
    public int Id { get; set; }

    // ── Relationship ──────────────────────────────────────────────────────────

    /// <summary>FK to the parent WhyChooseUsPageContent singleton (always 1).</summary>
    public int WhyChooseUsPageContentId { get; set; }

    [ForeignKey(nameof(WhyChooseUsPageContentId))]
    public WhyChooseUsPageContent WhyChooseUsPageContent { get; set; } = null!;

    // ── Display fields ────────────────────────────────────────────────────────

    /// <summary>Emoji or symbol shown in the stat panel — e.g. "🏆", "🏗️", "🎓".</summary>
    [Required, MaxLength(10)]
    public string Icon { get; set; } = "⭐";

    /// <summary>Card heading — e.g. "Academic Excellence".</summary>
    [Required, MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Smaller eyebrow line shown above the description — e.g. "Top Results, Year After Year".
    /// </summary>
    [MaxLength(200)]
    public string Subtitle { get; set; } = string.Empty;

    /// <summary>Three to five sentences elaborating on why this differentiates Alber School.</summary>
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    // ── Stat panel ────────────────────────────────────────────────────────────

    /// <summary>Prominent figure shown in the stat bubble — e.g. "97%", "86", "30+".</summary>
    [MaxLength(30)]
    public string Stat { get; set; } = string.Empty;

    /// <summary>Caption beneath the stat figure — e.g. "KCSE Pass Rate".</summary>
    [MaxLength(100)]
    public string StatLabel { get; set; } = string.Empty;

    // ── Styling ───────────────────────────────────────────────────────────────

    /// <summary>
    /// Colour theme key that controls the card's background, text, and border tints.
    /// Accepted values: gold · blue · green · purple · teal · rose · amber
    /// </summary>
    [Required, MaxLength(20)]
    public string Color { get; set; } = "gold";

    // ── Ordering & visibility ─────────────────────────────────────────────────

    /// <summary>Controls the alternating display order. Lower = earlier.</summary>
    public int SortOrder { get; set; } = 0;

    /// <summary>
    /// When false, the card is hidden on the public page (draft mode).
    /// Admins can toggle this without deleting the row.
    /// </summary>
    public bool IsPublished { get; set; } = true;

    // ── Audit ─────────────────────────────────────────────────────────────────

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
