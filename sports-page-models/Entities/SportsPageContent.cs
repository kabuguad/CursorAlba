using System.ComponentModel.DataAnnotations;

namespace Entities.Models.Sports;

/// <summary>
/// Singleton row that holds all editable text fields for the public /sports page.
/// Only one row ever exists (Id = 1). Use UPSERT / EnsureSeeded on startup.
/// Child collections (offered sports, trophies, fixtures, player spotlight) are
/// navigated via the respective navigation properties.
/// </summary>
public class SportsPageContent
{
    [Key]
    public int Id { get; set; } = 1;

    // ── Hero section ──────────────────────────────────────────────────────────

    /// <summary>Main page heading — e.g. "Sports &amp; Athletics"</summary>
    [Required, MaxLength(300)]
    public string Headline { get; set; } = string.Empty;

    /// <summary>Paragraph shown directly below the heading.</summary>
    [Required, MaxLength(1000)]
    public string Subheadline { get; set; } = string.Empty;

    // ── Audit ─────────────────────────────────────────────────────────────────

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Navigation (one-to-many) ──────────────────────────────────────────────

    public ICollection<SportOffered>  SportsOffered { get; set; } = new List<SportOffered>();
    public ICollection<SportTrophy>   Trophies      { get; set; } = new List<SportTrophy>();
    public ICollection<SportFixture>  Fixtures      { get; set; } = new List<SportFixture>();

    /// <summary>
    /// At most one active record at a time. The service enforces this by
    /// setting <see cref="PlayerOfMonth.IsActive"/> = false on all others before activating a new one.
    /// </summary>
    public ICollection<PlayerOfMonth> PlayerSpotlights { get; set; } = new List<PlayerOfMonth>();
}
