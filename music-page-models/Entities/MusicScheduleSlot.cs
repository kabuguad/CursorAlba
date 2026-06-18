using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models.Music;

/// <summary>
/// One day's rehearsal schedule shown in the "Weekly Rehearsal Schedule" grid on the /music page.
/// Each row represents a weekday; multiple sessions for the same day are stored as a
/// newline-separated (\n) list in <see cref="Slots"/>.
/// </summary>
public class MusicScheduleSlot
{
    [Key]
    public int Id { get; set; }

    /// <summary>Day name — e.g. "Monday", "Tuesday".</summary>
    [Required, MaxLength(20)]
    public string Day { get; set; } = string.Empty;

    /// <summary>
    /// Newline-separated (\n) session strings for this day — e.g.
    /// "Piano — 3:30–5:00 PM\nChoir Rehearsal — 4:00–5:30 PM".
    /// Split on '\n' and trim each entry before rendering as list items.
    /// </summary>
    [Required, MaxLength(1000)]
    public string Slots { get; set; } = string.Empty;

    /// <summary>Controls display order (Mon=1 … Fri=5). Lower = earlier.</summary>
    public int SortOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Foreign key ───────────────────────────────────────────────────────────

    public int MusicPageContentId { get; set; }

    [ForeignKey(nameof(MusicPageContentId))]
    public MusicPageContent MusicPageContent { get; set; } = null!;
}
