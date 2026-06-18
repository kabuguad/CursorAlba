using System.ComponentModel.DataAnnotations;

namespace Entities.Models.Drama;

/// <summary>
/// Singleton row that holds all editable text fields for the public /drama-dance page.
/// Only one row ever exists (Id = 1). Use UPSERT / EnsureSeeded on startup.
/// Child collections (dance styles, past plays, faculty, schedule) are navigated
/// via the respective navigation properties.
/// </summary>
public class DramaDancePageContent
{
    [Key]
    public int Id { get; set; } = 1;

    // ── Hero section ──────────────────────────────────────────────────────────

    /// <summary>Main page heading — e.g. "Drama &amp; Dance"</summary>
    [Required, MaxLength(300)]
    public string Headline { get; set; } = string.Empty;

    /// <summary>Tagline shown below the heading.</summary>
    [Required, MaxLength(1000)]
    public string Subheadline { get; set; } = string.Empty;

    // ── Audit ─────────────────────────────────────────────────────────────────

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Navigation (one-to-many) ──────────────────────────────────────────────

    public ICollection<DanceStyle>        DanceStyles    { get; set; } = new List<DanceStyle>();
    public ICollection<DramaPlay>         Plays          { get; set; } = new List<DramaPlay>();
    public ICollection<DramaFaculty>      Faculty        { get; set; } = new List<DramaFaculty>();
    public ICollection<DramaScheduleSlot> ScheduleSlots  { get; set; } = new List<DramaScheduleSlot>();
}
