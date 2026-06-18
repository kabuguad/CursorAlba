using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models.Cocurr;

/// <summary>
/// One of the four co-curricular tab panels shown on the /co-curricular hub page.
/// Examples: "Sports &amp; Physical" · "Creative &amp; Performing Arts" · "Social &amp; Community" · "Career &amp; Technical".
/// Each category parents a collection of individual <see cref="CocurrActivity"/> cards.
/// </summary>
public class CocurrCategory
{
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Emoji displayed on the tab button and in the category banner — e.g. "🏆", "🎭", "🤝", "⚙️".
    /// </summary>
    [Required, MaxLength(10)]
    public string Icon { get; set; } = "⭐";

    /// <summary>Tab label — e.g. "Sports &amp; Physical".</summary>
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Full heading shown inside the category banner panel — e.g. "Sports &amp; Physical Activities".
    /// May differ from the short tab <see cref="Title"/>.
    /// </summary>
    [Required, MaxLength(300)]
    public string Heading { get; set; } = string.Empty;

    /// <summary>One- or two-sentence description shown inside the category banner.</summary>
    [Required, MaxLength(1000)]
    public string Intro { get; set; } = string.Empty;

    /// <summary>Controls the display order of the tabs. Lower = earlier.</summary>
    public int SortOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Foreign key ───────────────────────────────────────────────────────────

    public int CocurrPageContentId { get; set; }

    [ForeignKey(nameof(CocurrPageContentId))]
    public CocurrPageContent CocurrPageContent { get; set; } = null!;

    // ── Navigation (one-to-many) ──────────────────────────────────────────────

    /// <summary>Individual activity cards displayed inside this category's tab panel.</summary>
    public ICollection<CocurrActivity> Activities { get; set; } = new List<CocurrActivity>();
}
