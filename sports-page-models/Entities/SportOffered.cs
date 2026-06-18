using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models.Sports;

/// <summary>
/// A sport offered by the school, shown in the "Sports Offered" grid on the /sports page.
/// Examples: Football · Basketball · Swimming.
/// </summary>
public class SportOffered
{
    [Key]
    public int Id { get; set; }

    /// <summary>Emoji icon — e.g. "⚽", "🏀", "🏊".</summary>
    [Required, MaxLength(10)]
    public string Icon { get; set; } = "🏅";

    /// <summary>Sport name — e.g. "Football".</summary>
    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    /// <summary>One- or two-sentence description of how the sport is offered.</summary>
    [Required, MaxLength(600)]
    public string Desc { get; set; } = string.Empty;

    /// <summary>Controls display order in the grid. Lower = earlier.</summary>
    public int SortOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Foreign key ───────────────────────────────────────────────────────────

    public int SportsPageContentId { get; set; }

    [ForeignKey(nameof(SportsPageContentId))]
    public SportsPageContent SportsPageContent { get; set; } = null!;
}
