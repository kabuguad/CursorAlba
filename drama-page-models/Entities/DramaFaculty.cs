using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models.Drama;

/// <summary>
/// A faculty card shown in the "Our Faculty" section on the /drama-dance page.
/// Examples: Lead Choreographer · Drama Director.
/// </summary>
public class DramaFaculty
{
    [Key]
    public int Id { get; set; }

    /// <summary>Faculty member's full name — e.g. "Ms. Grace Achieng".</summary>
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    /// <summary>Role and specialisation — e.g. "Lead Choreographer · Ballet &amp; Contemporary".</summary>
    [Required, MaxLength(300)]
    public string Role { get; set; } = string.Empty;

    /// <summary>Absolute URL to the faculty member's profile photo.</summary>
    [MaxLength(2048)]
    public string Img { get; set; } = string.Empty;

    /// <summary>Short biography paragraph.</summary>
    [MaxLength(600)]
    public string Bio { get; set; } = string.Empty;

    /// <summary>Controls display order in the faculty grid. Lower = earlier.</summary>
    public int SortOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Foreign key ───────────────────────────────────────────────────────────

    public int DramaDancePageContentId { get; set; }

    [ForeignKey(nameof(DramaDancePageContentId))]
    public DramaDancePageContent DramaDancePageContent { get; set; } = null!;
}
