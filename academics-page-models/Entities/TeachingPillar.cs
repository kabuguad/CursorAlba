using System.ComponentModel.DataAnnotations;

namespace Entities.Models.Academics;

/// <summary>
/// A teaching-philosophy card shown in the "Teaching Approach" section of the
/// /academics page (e.g. Holistic Development, Learner-Centred Teaching).
/// Standalone entity — not a child of AcademicsPageContent.
/// </summary>
public class TeachingPillar
{
    [Key]
    public int Id { get; set; }

    /// <summary>Emoji or symbol shown on the card — e.g. "🌱", "🎯", "📊".</summary>
    [Required, MaxLength(10)]
    public string Icon { get; set; } = "📌";

    /// <summary>Pillar name — e.g. "Holistic Development".</summary>
    [Required, MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    /// <summary>Two to four sentences describing what this pillar means for learners.</summary>
    [MaxLength(600)]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Colour gradient key that controls the card's background and border.
    /// Accepted values: green · blue · amber · purple · red · teal · indigo · pink · gold · slate
    /// Default: "green"
    /// </summary>
    [Required, MaxLength(20)]
    public string Gradient { get; set; } = "green";

    /// <summary>Controls the display order. Lower = earlier.</summary>
    public int SortOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
