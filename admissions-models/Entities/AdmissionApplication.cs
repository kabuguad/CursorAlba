using System.ComponentModel.DataAnnotations;

namespace Entities.Models.Admissions;

public class AdmissionApplication
{
    [Key]
    public int Id { get; set; }

    /// <summary>Human-readable reference generated server-side e.g. ALB-2026-4721.</summary>
    [Required, MaxLength(20)]
    public string ReferenceNumber { get; set; } = string.Empty;

    // ── Step 1: Child ────────────────────────────────────────────────────────

    [Required, MaxLength(100)]
    public string ChildFirstName { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string ChildLastName { get; set; } = string.Empty;

    [Required]
    public DateOnly DateOfBirth { get; set; }

    /// <summary>
    /// One of: "Daycare / PP1-PP2" | "Primary (Gr. 1–6)" |
    /// "Junior Secondary (Gr. 7–9)" | "Senior School / IGCSE".
    /// Stored as plain text — no FK — so new levels need no migration.
    /// </summary>
    [Required, MaxLength(100)]
    public string ApplyingForGrade { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? PreviousSchool { get; set; }

    // ── Step 2: Parent / Guardian ────────────────────────────────────────────

    [Required, MaxLength(100)]
    public string ParentFirstName { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string ParentLastName { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(150)]
    public string ParentEmail { get; set; } = string.Empty;

    [Required, MaxLength(30)]
    public string ParentPhone { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? ParentIdNumber { get; set; }

    /// <summary>e.g. "Mother", "Father", "Guardian"</summary>
    [MaxLength(60)]
    public string? ParentRelationship { get; set; }

    // ── Admin / Status ───────────────────────────────────────────────────────

    public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;

    [MaxLength(2000)]
    public string? AdminNotes { get; set; }

    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ReviewedAt { get; set; }

    /// <summary>Email or display name of the admin who last changed the status.</summary>
    [MaxLength(150)]
    public string? ReviewedBy { get; set; }

    // ── Navigation ───────────────────────────────────────────────────────────

    public ICollection<AdmissionDocument> Documents { get; set; } = [];
}
