using System.ComponentModel.DataAnnotations;
using Entities.Models.Admissions;
using Microsoft.AspNetCore.Http;

namespace AlbaApi.Presentation.DTOs.Admissions;

// ── PUBLIC: POST /api/admissions ─────────────────────────────────────────────
// Step 1 (Child) + Step 2 (Parent) combined into one JSON body.
// No auth required — any visitor can submit.

public class SubmitApplicationDto
{
    // Child
    [Required, MaxLength(100)] public string   ChildFirstName    { get; set; } = string.Empty;
    [Required, MaxLength(100)] public string   ChildLastName     { get; set; } = string.Empty;
    [Required]                 public DateOnly DateOfBirth       { get; set; }
    [Required, MaxLength(100)] public string   ApplyingForGrade  { get; set; } = string.Empty;
    [MaxLength(200)]           public string?  PreviousSchool    { get; set; }

    // Parent / Guardian
    [Required, MaxLength(100)]               public string  ParentFirstName    { get; set; } = string.Empty;
    [Required, MaxLength(100)]               public string  ParentLastName     { get; set; } = string.Empty;
    [Required, EmailAddress, MaxLength(150)] public string  ParentEmail        { get; set; } = string.Empty;
    [Required, MaxLength(30)]                public string  ParentPhone        { get; set; } = string.Empty;
    [MaxLength(50)]                          public string? ParentIdNumber     { get; set; }
    [MaxLength(60)]                          public string? ParentRelationship { get; set; }
}

// ── PUBLIC: POST /api/admissions/{id}/documents ──────────────────────────────
// Step 3 (Documents). Consumed via [FromForm] — multipart, not JSON.
// Call once per file (up to 3 calls: BirthCertificate, SchoolReport, ParentId).

public class UploadDocumentDto
{
    /// <summary>"BirthCertificate" | "SchoolReport" | "ParentId"</summary>
    [Required, MaxLength(50)]
    public string DocumentType { get; set; } = string.Empty;

    [Required]
    public IFormFile File { get; set; } = null!;
}

// ── ADMIN: PATCH /api/admin/admissions/{id}/status ───────────────────────────
// Admin updates the status and optionally adds notes.

public class UpdateApplicationStatusDto
{
    [Required]
    public ApplicationStatus Status { get; set; }

    [MaxLength(2000)]
    public string? AdminNotes { get; set; }
}
