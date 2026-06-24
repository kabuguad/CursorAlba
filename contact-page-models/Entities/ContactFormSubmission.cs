using System.ComponentModel.DataAnnotations;

namespace Entities.Models.Contact;

/// <summary>
/// One row per message submitted via the public /contact form.
/// </summary>
public class ContactFormSubmission
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required, MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    /// <summary>Optional — phone or WhatsApp number supplied by the visitor.</summary>
    [MaxLength(30)]
    public string? Phone { get; set; }

    /// <summary>
    /// One of: Admissions Enquiry | Campus Tour Request | Fee Structure | General Enquiry.
    /// Stored as plain text so new options can be added without a migration.
    /// </summary>
    [MaxLength(100)]
    public string Subject { get; set; } = "General Enquiry";

    [Required, MaxLength(2000)]
    public string Message { get; set; } = string.Empty;

    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Toggled by admin once the message has been read / actioned.</summary>
    public bool IsRead { get; set; } = false;

    /// <summary>Optional admin notes / follow-up record.</summary>
    [MaxLength(1000)]
    public string? AdminNotes { get; set; }
}
