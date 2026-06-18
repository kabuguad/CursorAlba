using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models.Cocurr;

/// <summary>
/// A single activity card displayed inside a co-curricular category tab panel.
/// Examples: "Athletics" · "Music" · "Community Service Learning" · "Culinary Arts".
/// </summary>
public class CocurrActivity
{
    [Key]
    public int Id { get; set; }

    /// <summary>Emoji icon for the card — e.g. "🏃", "🎵", "❤️", "🏨".</summary>
    [Required, MaxLength(10)]
    public string Icon { get; set; } = "⭐";

    /// <summary>Activity name — e.g. "Athletics".</summary>
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    /// <summary>One- or two-sentence description shown on the card.</summary>
    [Required, MaxLength(600)]
    public string Desc { get; set; } = string.Empty;

    /// <summary>Controls the display order within the category. Lower = earlier.</summary>
    public int SortOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Foreign key ───────────────────────────────────────────────────────────

    public int CocurrCategoryId { get; set; }

    [ForeignKey(nameof(CocurrCategoryId))]
    public CocurrCategory Category { get; set; } = null!;
}
