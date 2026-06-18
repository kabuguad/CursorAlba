using System.ComponentModel.DataAnnotations;

namespace Entities.Models.About;

/// <summary>
/// A single core-value card shown in the "Our Values" grid on the /about page.
/// Examples: Academic Excellence · Integrity · Innovation · Holistic Growth.
/// </summary>
public class CoreValue
{
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Emoji or Unicode symbol displayed as the card icon — e.g. "🎓", "🤝", "💡".
    /// Stored as a short string so it can be changed without a code deploy.
    /// </summary>
    [Required, MaxLength(10)]
    public string Icon { get; set; } = "⭐";

    /// <summary>Short value name — e.g. "Academic Excellence".</summary>
    [Required, MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    /// <summary>One or two sentences elaborating on the value.</summary>
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    /// <summary>Controls the display order in the grid. Lower = earlier.</summary>
    public int SortOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
