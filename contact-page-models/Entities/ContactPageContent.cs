using System.ComponentModel.DataAnnotations;

namespace Entities.Models.Contact;

/// <summary>
/// Singleton row that holds all editable text and contact fields for the public /contact page.
/// Only one row ever exists (Id = 1). Use UPSERT / EnsureSeeded on startup.
/// </summary>
public class ContactPageContent
{
    [Key]
    public int Id { get; set; } = 1;

    // ── Hero ──────────────────────────────────────────────────────────────────

    [Required, MaxLength(200)]
    public string HeroHeadline { get; set; } = "Contact Us";

    [Required, MaxLength(400)]
    public string HeroSubheadline { get; set; } =
        "Adjacent to the Governor's Offices, Kutus — Kirinyaga County. We're here to help.";

    /// <summary>Full URL for the hero background image.</summary>
    [MaxLength(500)]
    public string HeroImageUrl { get; set; } =
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80";

    // ── Phone ─────────────────────────────────────────────────────────────────

    [Required, MaxLength(30)]
    public string PhonePrimary { get; set; } = "+254 712 345 678";

    [MaxLength(30)]
    public string PhoneSecondary { get; set; } = "+254 734 567 890";

    // ── Email ─────────────────────────────────────────────────────────────────

    [Required, MaxLength(100)]
    public string EmailPrimary { get; set; } = "info@alberschool.ke";

    [MaxLength(100)]
    public string EmailSecondary { get; set; } = "admissions@alberschool.ke";

    // ── WhatsApp ──────────────────────────────────────────────────────────────

    /// <summary>
    /// Digits only, used in wa.me links.
    /// e.g. "254712345678" (country code + number, no + or spaces).
    /// </summary>
    [Required, MaxLength(20)]
    public string WhatsAppNumber { get; set; } = "254712345678";

    // ── Address ───────────────────────────────────────────────────────────────

    [Required, MaxLength(200)]
    public string AddressLine1 { get; set; } = "Adjacent to Governor's Offices";

    [Required, MaxLength(200)]
    public string AddressLine2 { get; set; } = "Kutus Town, Kirinyaga County";

    /// <summary>Google Maps embed src URL.</summary>
    [MaxLength(1000)]
    public string MapEmbedUrl { get; set; } =
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.5!2d37.285!3d-0.518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1828bf2f9c72a4a1%3A0x4a6d4f5e1b3c2d8e!2sKutus%2C%20Kirinyaga!5e0!3m2!1sen!2ske!4v1";

    // ── Office Hours ──────────────────────────────────────────────────────────

    [Required, MaxLength(300)]
    public string OfficeHours { get; set; } =
        "Monday \u2013 Friday 7:30 AM \u2013 5:00 PM \u00B7 Saturday 8:00 AM \u2013 1:00 PM";

    /// <summary>Small note shown beside office hours (e.g. WhatsApp out-of-hours tip).</summary>
    [MaxLength(300)]
    public string OfficeHoursNote { get; set; } =
        "For urgent matters outside office hours, please use WhatsApp.";

    // ── Audit ─────────────────────────────────────────────────────────────────

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
