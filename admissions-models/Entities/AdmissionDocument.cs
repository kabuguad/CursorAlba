using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models.Admissions;

public class AdmissionDocument
{
    [Key]
    public int Id { get; set; }

    // ── FK to parent application ─────────────────────────────────────────────

    public int AdmissionApplicationId { get; set; }

    [ForeignKey(nameof(AdmissionApplicationId))]
    public AdmissionApplication Application { get; set; } = null!;

    // ── File metadata ────────────────────────────────────────────────────────

    /// <summary>
    /// One of: "BirthCertificate" | "SchoolReport" | "ParentId".
    /// Plain text — add new types without a migration.
    /// </summary>
    [Required, MaxLength(50)]
    public string DocumentType { get; set; } = string.Empty;

    /// <summary>Relative path on disk: "uploads/admissions/{appId}/{filename}"</summary>
    [Required, MaxLength(500)]
    public string FilePath { get; set; } = string.Empty;

    [MaxLength(260)]
    public string? OriginalFileName { get; set; }

    /// <summary>MIME type e.g. "application/pdf", "image/jpeg"</summary>
    [MaxLength(100)]
    public string? ContentType { get; set; }

    public long FileSizeBytes { get; set; }

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
