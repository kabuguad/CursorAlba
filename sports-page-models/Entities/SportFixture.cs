using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models.Sports;

/// <summary>Fixture/result status values matching the frontend status badge.</summary>
public enum FixtureStatus
{
    Upcoming  = 0,
    Live      = 1,
    Completed = 2,
}

/// <summary>
/// A single fixture or result row displayed in the "Fixtures &amp; Results" table on the /sports page.
/// Already API-driven in the frontend — this entity backs that live endpoint.
/// </summary>
public class SportFixture
{
    [Key]
    public int Id { get; set; }

    /// <summary>Sport name — e.g. "Football", "Swimming".</summary>
    [Required, MaxLength(150)]
    public string Sport { get; set; } = string.Empty;

    /// <summary>Opponent school or event name — e.g. "St. Annes Academy".</summary>
    [Required, MaxLength(300)]
    public string Opponent { get; set; } = string.Empty;

    /// <summary>Date of the fixture in ISO 8601 format — e.g. "2026-03-20".</summary>
    [Required, MaxLength(20)]
    public string Date { get; set; } = string.Empty;

    /// <summary>Venue name — e.g. "Home", "Away", "Aquatic Centre".</summary>
    [Required, MaxLength(300)]
    public string Venue { get; set; } = string.Empty;

    /// <summary>
    /// Result string — e.g. "3-1", "12 Gold", "Live", or "—" when not yet played.
    /// </summary>
    [MaxLength(50)]
    public string Result { get; set; } = "—";

    /// <summary>Display status driving the badge colour in the UI.</summary>
    public FixtureStatus Status { get; set; } = FixtureStatus.Upcoming;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Foreign key ───────────────────────────────────────────────────────────

    public int SportsPageContentId { get; set; }

    [ForeignKey(nameof(SportsPageContentId))]
    public SportsPageContent SportsPageContent { get; set; } = null!;
}
