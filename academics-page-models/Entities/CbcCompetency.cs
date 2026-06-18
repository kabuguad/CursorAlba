using System.ComponentModel.DataAnnotations;

namespace Entities.Models.Academics;

/// <summary>
/// A CBC core competency card shown in the "Our Approach / CBC Difference"
/// section on the /academics page.
/// Examples: Communication &amp; Collaboration · Critical Thinking · Digital Literacy.
/// Standalone entity — not a child of AcademicsPageContent.
/// </summary>
public class CbcCompetency
{
    [Key]
    public int Id { get; set; }

    /// <summary>Emoji or symbol shown on the card — e.g. "🗣️", "🧠", "💡".</summary>
    [Required, MaxLength(10)]
    public string Icon { get; set; } = "⭐";

    /// <summary>Competency name — e.g. "Digital Literacy".</summary>
    [Required, MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    /// <summary>Two to four sentences explaining the competency.</summary>
    [MaxLength(600)]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// When true, the card is rendered in the wider gold-accent "featured" style.
    /// Only one competency is typically featured at a time, but this is not
    /// enforced at the database level.
    /// </summary>
    public bool IsFeatured { get; set; } = false;

    /// <summary>Controls the display order. Lower = earlier.</summary>
    public int SortOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
