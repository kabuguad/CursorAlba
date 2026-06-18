using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models.Music;

/// <summary>
/// An instrument card shown in the "Instruments Offered" grid on the /music page.
/// Examples: Piano · Violin · Guitar · Drums &amp; Percussion.
/// </summary>
public class MusicInstrument
{
    [Key]
    public int Id { get; set; }

    /// <summary>Emoji icon — e.g. "🎹", "🎻", "🎸".</summary>
    [Required, MaxLength(10)]
    public string Icon { get; set; } = "🎵";

    /// <summary>Instrument name — e.g. "Piano".</summary>
    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    /// <summary>One- or two-sentence description of lessons offered.</summary>
    [Required, MaxLength(600)]
    public string Desc { get; set; } = string.Empty;

    /// <summary>Controls display order in the grid. Lower = earlier.</summary>
    public int SortOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Foreign key ───────────────────────────────────────────────────────────

    public int MusicPageContentId { get; set; }

    [ForeignKey(nameof(MusicPageContentId))]
    public MusicPageContent MusicPageContent { get; set; } = null!;
}
