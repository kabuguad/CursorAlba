using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models.Sports;

/// <summary>
/// A "Player of the Month" spotlight card shown on the /sports page.
/// The service ensures only one record has <see cref="IsActive"/> = true at any time.
/// Inactive records are retained as a historical archive.
/// </summary>
public class PlayerOfMonth
{
    [Key]
    public int Id { get; set; }

    /// <summary>Student's full name — e.g. "Brian Mutua".</summary>
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    /// <summary>Sport the player is recognised for — e.g. "Football".</summary>
    [Required, MaxLength(150)]
    public string Sport { get; set; } = string.Empty;

    /// <summary>Class or form — e.g. "Form 3 Ruby".</summary>
    [Required, MaxLength(100)]
    public string Class { get; set; } = string.Empty;

    /// <summary>Absolute URL to the player's profile image.</summary>
    [MaxLength(2048)]
    public string Image { get; set; } = string.Empty;

    /// <summary>Short stats string — e.g. "14 goals · 8 assists · Captain".</summary>
    [MaxLength(300)]
    public string Stats { get; set; } = string.Empty;

    /// <summary>
    /// When true this record is shown in the live spotlight card.
    /// Only one record should have IsActive = true at any time.
    /// </summary>
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Foreign key ───────────────────────────────────────────────────────────

    public int SportsPageContentId { get; set; }

    [ForeignKey(nameof(SportsPageContentId))]
    public SportsPageContent SportsPageContent { get; set; } = null!;
}
