using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models.Music;

/// <summary>
/// A music faculty card shown in the "Our Music Faculty" section on the /music page.
/// </summary>
public class MusicTeacher
{
    [Key]
    public int Id { get; set; }

    /// <summary>Teacher's full name — e.g. "Ms. Ruth Kamau".</summary>
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    /// <summary>Specialisation label — e.g. "Piano &amp; Theory".</summary>
    [Required, MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    /// <summary>Absolute URL to the teacher's profile photo.</summary>
    [MaxLength(2048)]
    public string Img { get; set; } = string.Empty;

    /// <summary>Short credentials line — e.g. "B.Mus (University of Nairobi) · ABRSM Grade 8".</summary>
    [MaxLength(400)]
    public string Credentials { get; set; } = string.Empty;

    /// <summary>Controls display order in the faculty grid. Lower = earlier.</summary>
    public int SortOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Foreign key ───────────────────────────────────────────────────────────

    public int MusicPageContentId { get; set; }

    [ForeignKey(nameof(MusicPageContentId))]
    public MusicPageContent MusicPageContent { get; set; } = null!;
}
