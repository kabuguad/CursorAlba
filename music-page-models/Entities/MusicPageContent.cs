using System.ComponentModel.DataAnnotations;

namespace Entities.Models.Music;

/// <summary>
/// Singleton row that holds all editable text fields for the public /music page.
/// Only one row ever exists (Id = 1). Use UPSERT / EnsureSeeded on startup.
/// Child collections (instruments, teachers, schedule) are navigated via
/// the respective navigation properties.
/// </summary>
public class MusicPageContent
{
    [Key]
    public int Id { get; set; } = 1;

    // ── Hero section ──────────────────────────────────────────────────────────

    /// <summary>Main page heading — e.g. "Music Academy"</summary>
    [Required, MaxLength(300)]
    public string Headline { get; set; } = string.Empty;

    /// <summary>Tagline shown below the heading.</summary>
    [Required, MaxLength(1000)]
    public string Subheadline { get; set; } = string.Empty;

    // ── Audit ─────────────────────────────────────────────────────────────────

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Navigation (one-to-many) ──────────────────────────────────────────────

    public ICollection<MusicInstrument>   Instruments    { get; set; } = new List<MusicInstrument>();
    public ICollection<MusicTeacher>      Teachers       { get; set; } = new List<MusicTeacher>();
    public ICollection<MusicScheduleSlot> ScheduleSlots  { get; set; } = new List<MusicScheduleSlot>();
}
