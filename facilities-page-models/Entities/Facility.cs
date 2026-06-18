using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models.Facilities;

/// <summary>
/// A single facility card shown in the grid on the /facilities page.
/// Examples: Smart Classrooms · Music Studio · Sports Complex.
/// </summary>
public class Facility
{
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Emoji displayed as the card icon and in the detail modal — e.g. "🖥️", "🎵", "🏟️".
    /// Stored as a short string so it can be changed without a code deploy.
    /// </summary>
    [Required, MaxLength(10)]
    public string Icon { get; set; } = "🏫";

    /// <summary>Display name of the facility — e.g. "Smart Classrooms".</summary>
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// One- or two-sentence description shown on the card and in the detail modal.
    /// </summary>
    [Required, MaxLength(1000)]
    public string Desc { get; set; } = string.Empty;

    /// <summary>
    /// Absolute URL to the facility hero image displayed in the card and modal.
    /// May be empty — the UI falls back to an icon-only gradient placeholder.
    /// </summary>
    [MaxLength(2048)]
    public string Img { get; set; } = string.Empty;

    /// <summary>
    /// Newline-separated (\n) list of short feature badges shown in the detail modal.
    /// Each line becomes one pill in the UI — e.g. "Interactive whiteboards\nHigh-speed fibre internet\nAir-conditioned\nCCTV monitored".
    /// Split on '\n' and trim each entry before rendering.
    /// </summary>
    [MaxLength(2000)]
    public string Highlights { get; set; } = string.Empty;

    /// <summary>Controls the display order in the grid. Lower = earlier.</summary>
    public int SortOrder { get; set; } = 0;

    /// <summary>
    /// When false the card is hidden from the public page but retained in the database
    /// so it can be re-published without data loss.
    /// </summary>
    public bool IsPublished { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Foreign key ───────────────────────────────────────────────────────────

    public int FacilitiesPageContentId { get; set; }

    [ForeignKey(nameof(FacilitiesPageContentId))]
    public FacilitiesPageContent FacilitiesPageContent { get; set; } = null!;
}
