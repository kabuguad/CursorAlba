// ── DbContext snippet — Admissions ────────────────────────────────────────────
// Add the DbSet properties and call ConfigureAdmissions(modelBuilder)
// from your OnModelCreating override.

using Entities.Models.Admissions;
using Microsoft.EntityFrameworkCore;

// ── DbSets — paste alongside your existing ones ───────────────────────────────

// public DbSet<AdmissionApplication> AdmissionApplications { get; set; }
// public DbSet<AdmissionDocument>    AdmissionDocuments    { get; set; }

// ── OnModelCreating config ────────────────────────────────────────────────────

internal static void ConfigureAdmissions(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<AdmissionApplication>(e =>
    {
        // Store enum as "Pending" / "Reviewing" etc. — readable in the SQLite browser
        // without needing a lookup table.
        e.Property(a => a.Status)
         .HasConversion<string>()
         .HasMaxLength(20);

        e.Property(a => a.SubmittedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Admin inbox: filter by status, sort by date, search by email
        e.HasIndex(a => a.Status);
        e.HasIndex(a => a.SubmittedAt);
        e.HasIndex(a => a.ParentEmail);

        // ReferenceNumber must be unique across all applications
        e.HasIndex(a => a.ReferenceNumber).IsUnique();
    });

    modelBuilder.Entity<AdmissionDocument>(e =>
    {
        // Cascade: deleting an application removes all its uploaded files too
        e.HasOne(d => d.Application)
         .WithMany(a => a.Documents)
         .HasForeignKey(d => d.AdmissionApplicationId)
         .OnDelete(DeleteBehavior.Cascade);

        e.Property(d => d.UploadedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
    });
}

// ── Reference number helper (put this in your service layer) ─────────────────
//
//   private static string GenerateReference()
//       => $"ALB-{DateTime.UtcNow.Year}-{Random.Shared.Next(1000, 9999)}";
//
//   If you need guaranteed uniqueness, check for collisions before saving:
//
//   string refNo;
//   do { refNo = GenerateReference(); }
//   while (await _db.AdmissionApplications.AnyAsync(a => a.ReferenceNumber == refNo));

// ── Suggested REST endpoints ──────────────────────────────────────────────────
//
//  POST   /api/admissions                          → public, no auth (submit Steps 1+2)
//  POST   /api/admissions/{id}/documents           → public, no auth (upload Step 3 files)
//  GET    /api/admissions/{id}                     → public (applicant checks their status by ref)
//
//  GET    /api/admin/admissions                    → admin, paginated + filterable by status
//  GET    /api/admin/admissions/{id}               → admin (full detail)
//  PATCH  /api/admin/admissions/{id}/status        → admin (change status + notes)
//  DELETE /api/admin/admissions/{id}               → admin (hard delete + remove files from disk)
//  GET    /api/admin/admissions/stats              → admin (counts by status for dashboard card)
//
// ── File storage note ─────────────────────────────────────────────────────────
//
//  Save uploaded files to: wwwroot/uploads/admissions/{applicationId}/{sanitisedFileName}
//  Serve them via the download endpoint above (not as static files — you need auth on those).
//  Max file size: 5 MB per document. Accept: .pdf, .jpg, .jpeg, .png
