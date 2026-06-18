using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models.Drama;

/// <summary>
/// An archived annual production shown in the "Annual Play Archives" section on the /drama-dance page.
/// Examples: "The Lion's Roar" (2024) · "Echoes of Kirinyaga" (2023).
/// </summary>
public class DramaPlay
{
    [Key]
    public int Id { get; set; }

    /// <summary>Year of the production — e.g. "2024".</summary>
    [Required, MaxLength(10)]
    public string Year { get; set; } = string.Empty;

    /// <summary>Production title — e.g. "The Lion's Roar".</summary>
    [Required, MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    /// <summary>Short synopsis shown on the archive card.</summary>
    [Required, MaxLength(600)]
    public string Desc { get; set; } = string.Empty;

    /// <summary>Absolute URL to the production's hero image.</summary>
    [MaxLength(2048)]
    public string Img { get; set; } = string.Empty;

    /// <summary>Controls display order (newest first = lowest SortOrder). Lower = earlier.</summary>
    public int SortOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Foreign key ───────────────────────────────────────────────────────────

    public int DramaDancePageContentId { get; set; }

    [ForeignKey(nameof(DramaDancePageContentId))]
    public DramaDancePageContent DramaDancePageContent { get; set; } = null!;
}
