using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models.Sports;

/// <summary>
/// A trophy cabinet entry shown on the /sports page.
/// Examples: "Kirinyaga County Football Champions 2025".
/// </summary>
public class SportTrophy
{
    [Key]
    public int Id { get; set; }

    /// <summary>Year the trophy was won — e.g. "2025".</summary>
    [Required, MaxLength(10)]
    public string Year { get; set; } = string.Empty;

    /// <summary>Full trophy or award title — e.g. "Kirinyaga County Football Champions".</summary>
    [Required, MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    /// <summary>Sport category the trophy belongs to — e.g. "Football", "Athletics".</summary>
    [Required, MaxLength(150)]
    public string Category { get; set; } = string.Empty;

    /// <summary>Controls display order in the trophy cabinet. Lower = earlier.</summary>
    public int SortOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Foreign key ───────────────────────────────────────────────────────────

    public int SportsPageContentId { get; set; }

    [ForeignKey(nameof(SportsPageContentId))]
    public SportsPageContent SportsPageContent { get; set; } = null!;
}
