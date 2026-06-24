// ── DbContext snippet — Contact page ───────────────────────────────────────────
// Add the DbSet properties and call ConfigureContact(modelBuilder)
// from your OnModelCreating override.

using Entities.Models.Contact;
using Microsoft.EntityFrameworkCore;

// ── DbSets — paste alongside your existing ones ───────────────────────────────

// public DbSet<ContactPageContent>    ContactPageContent     { get; set; }
// public DbSet<ContactFormSubmission> ContactFormSubmissions { get; set; }

// ── OnModelCreating config ────────────────────────────────────────────────────

internal static void ConfigureContact(ModelBuilder modelBuilder)
{
    // ── Singleton page content ────────────────────────────────────────────────

    modelBuilder.Entity<ContactPageContent>(e =>
    {
        e.Property(c => c.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Seed the default row so GET /api/contact-page-content always returns data.
        e.HasData(new ContactPageContent
        {
            Id = 1,

            HeroHeadline    = "Contact Us",
            HeroSubheadline = "Adjacent to the Governor\u2019s Offices, Kutus \u2014 Kirinyaga County. We\u2019re here to help.",
            HeroImageUrl    = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",

            PhonePrimary    = "+254 712 345 678",
            PhoneSecondary  = "+254 734 567 890",

            EmailPrimary    = "info@alberschool.ke",
            EmailSecondary  = "admissions@alberschool.ke",

            WhatsAppNumber  = "254712345678",

            AddressLine1    = "Adjacent to Governor\u2019s Offices",
            AddressLine2    = "Kutus Town, Kirinyaga County",
            MapEmbedUrl     = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.5!2d37.285!3d-0.518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1828bf2f9c72a4a1%3A0x4a6d4f5e1b3c2d8e!2sKutus%2C%20Kirinyaga!5e0!3m2!1sen!2ske!4v1",

            OfficeHours     = "Monday \u2013 Friday 7:30 AM \u2013 5:00 PM \u00B7 Saturday 8:00 AM \u2013 1:00 PM",
            OfficeHoursNote = "For urgent matters outside office hours, please use WhatsApp.",

            UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        });
    });

    // ── Form submissions ──────────────────────────────────────────────────────

    modelBuilder.Entity<ContactFormSubmission>(e =>
    {
        e.Property(c => c.SubmittedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Indexes for the admin inbox: sort by date, filter by IsRead.
        e.HasIndex(c => c.SubmittedAt);
        e.HasIndex(c => c.IsRead);
    });
}

// ── Suggested REST endpoints ──────────────────────────────────────────────────
//
//  GET    /api/contact-page-content          → public + admin (fetch editable content)
//  PUT    /api/contact-page-content/1        → admin (update page content)
//  POST   /api/contact-form-submissions      → public, no auth (visitor submits form)
//  GET    /api/contact-form-submissions      → admin, paginated (inbox)
//  PATCH  /api/contact-form-submissions/{id} → admin (mark read / add notes)
//  DELETE /api/contact-form-submissions/{id} → admin (delete message)
