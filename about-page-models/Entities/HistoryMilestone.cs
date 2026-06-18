using System.ComponentModel.DataAnnotations;

namespace Entities.Models.About;

/// <summary>
/// A single milestone entry in the "Our History" timeline on the /about page.
/// Each entry represents a significant year in the school's history.
/// </summary>
public class HistoryMilestone
{
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Four-digit year label displayed prominently on the timeline — e.g. "2005".
    /// Stored as a string to allow custom labels like "2005–2008" if needed.
    /// </summary>
    [Required, MaxLength(20)]
    public string Year { get; set; } = string.Empty;

    /// <summary>Short title for the milestone — e.g. "Foundation", "Arts Academy".</summary>
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    /// <summary>One to three sentences describing what happened that year.</summary>
    [MaxLength(800)]
    public string Description { get; set; } = string.Empty;

    /// <summary>Controls the display order in the timeline. Lower = earlier.</summary>
    public int SortOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
