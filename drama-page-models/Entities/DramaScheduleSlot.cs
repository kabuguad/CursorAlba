using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models.Drama;

/// <summary>
/// One day's rehearsal entry shown in the "Rehearsal Schedule" grid on the /drama-dance page.
/// Unlike the music schedule, each drama slot has a single activity string per day.
/// </summary>
public class DramaScheduleSlot
{
    [Key]
    public int Id { get; set; }

    /// <summary>Day name — e.g. "Monday".</summary>
    [Required, MaxLength(20)]
    public string Day { get; set; } = string.Empty;

    /// <summary>
    /// Full activity description for this day — e.g. "Ballet — 4:00–5:30 PM".
    /// </summary>
    [Required, MaxLength(300)]
    public string Activity { get; set; } = string.Empty;

    /// <summary>Controls display order (Mon=1 … Fri=5). Lower = earlier.</summary>
    public int SortOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Foreign key ───────────────────────────────────────────────────────────

    public int DramaDancePageContentId { get; set; }

    [ForeignKey(nameof(DramaDancePageContentId))]
    public DramaDancePageContent DramaDancePageContent { get; set; } = null!;
}
