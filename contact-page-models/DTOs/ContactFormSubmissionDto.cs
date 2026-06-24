using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Contact;

// ── Create DTO (public form POST — no auth required) ─────────────────────────

public class CreateContactFormSubmissionDto
{
    [Required, MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(30)]
    public string? Phone { get; set; }

    [MaxLength(100)]
    public string Subject { get; set; } = "General Enquiry";

    [Required, MinLength(10), MaxLength(2000)]
    public string Message { get; set; } = string.Empty;
}

// ── Patch DTO (admin — mark read / add notes) ─────────────────────────────────

public class PatchContactFormSubmissionDto
{
    public bool?   IsRead     { get; set; }
    public string? AdminNotes { get; set; }
}

// ── Response DTO ──────────────────────────────────────────────────────────────

public class ContactFormSubmissionResponseDto
{
    public int      Id          { get; set; }
    public string   FullName    { get; set; } = string.Empty;
    public string   Email       { get; set; } = string.Empty;
    public string?  Phone       { get; set; }
    public string   Subject     { get; set; } = string.Empty;
    public string   Message     { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public bool     IsRead      { get; set; }
    public string?  AdminNotes  { get; set; }
}
