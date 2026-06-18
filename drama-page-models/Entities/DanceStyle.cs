using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models.Drama;

/// <summary>
/// A dance style card shown in the "Dance Styles Offered" grid on the /drama-dance page.
/// Examples: Ballet · Contemporary · African Dance · Hip-Hop.
/// </summary>
public class DanceStyle
{
    [Key]
    public int Id { get; set; }

    /// <summary>Style name — e.g. "Ballet".</summary>
    [Required, MaxLength(150)]
    public string Style { get; set; } = string.Empty;

    /// <summary>Emoji icon — e.g. "🩰", "💫", "🥁", "🎤".</summary>
    [Required, MaxLength(10)]
    public string Icon { get; set; } = "💃";

    /// <summary>One- or two-sentence description of the style.</summary>
    [Required, MaxLength(600)]
    public string Desc { get; set; } = string.Empty;

    /// <summary>Controls display order in the grid. Lower = earlier.</summary>
    public int SortOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Foreign key ───────────────────────────────────────────────────────────

    public int DramaDancePageContentId { get; set; }

    [ForeignKey(nameof(DramaDancePageContentId))]
    public DramaDancePageContent DramaDancePageContent { get; set; } = null!;
}
