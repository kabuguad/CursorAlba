// ── DbContext snippet ─────────────────────────────────────────────────────────
// Add these DbSet properties and OnModelCreating rules to your existing
// AlberSchoolDbContext (or whatever your DbContext is named).

using Entities.Models.Content;
using Microsoft.EntityFrameworkCore;

// Inside your DbContext class:

// DbSets — paste these alongside your existing ones
// public DbSet<BlogPost>          BlogPosts          { get; set; }
// public DbSet<Event>             Events             { get; set; }
// public DbSet<GalleryImage>      GalleryImages      { get; set; }
// public DbSet<Announcement>      Announcements      { get; set; }
// public DbSet<AnnouncementTarget> AnnouncementTargets { get; set; }

// ─────────────────────────────────────────────────────────────────────────────
// OnModelCreating — paste inside your existing override
// ─────────────────────────────────────────────────────────────────────────────
internal static void ConfigureContentMedia(ModelBuilder modelBuilder)
{
    // ── BlogPost ──────────────────────────────────────────────────────────────
    modelBuilder.Entity<BlogPost>(e =>
    {
        e.HasIndex(b => b.Slug).IsUnique();
        e.Property(b => b.IsPublished).HasDefaultValue(false);
        e.Property(b => b.ViewCount).HasDefaultValue(0);
        e.Property(b => b.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(b => b.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
    });

    // ── Event ─────────────────────────────────────────────────────────────────
    modelBuilder.Entity<Event>(e =>
    {
        e.Property(ev => ev.IsPublished).HasDefaultValue(true);
        e.Property(ev => ev.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(ev => ev.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        // IsPast is [NotMapped] — exclude it explicitly (EF Core should ignore it,
        // but this makes the intent explicit):
        e.Ignore(ev => ev.IsPast);
    });

    // ── GalleryImage ──────────────────────────────────────────────────────────
    modelBuilder.Entity<GalleryImage>(e =>
    {
        e.Property(g => g.IsPublic).HasDefaultValue(true);
        e.Property(g => g.SortOrder).HasDefaultValue(0);
        e.Property(g => g.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
    });

    // ── Announcement ──────────────────────────────────────────────────────────
    modelBuilder.Entity<Announcement>(e =>
    {
        e.Property(a => a.Priority)
         .HasConversion<string>()   // store as "Normal" / "High" / "Urgent"
         .HasMaxLength(20);

        e.Property(a => a.Status)
         .HasConversion<string>()   // store as "Draft" / "Published"
         .HasMaxLength(20);

        e.Property(a => a.ReadCount).HasDefaultValue(0);
        e.Property(a => a.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(a => a.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        e.HasMany(a => a.Targets)
         .WithOne(t => t.Announcement)
         .HasForeignKey(t => t.AnnouncementId)
         .OnDelete(DeleteBehavior.Cascade);
    });

    // ── AnnouncementTarget ────────────────────────────────────────────────────
    modelBuilder.Entity<AnnouncementTarget>(e =>
    {
        // Composite unique constraint — an announcement can only target each role once
        e.HasIndex(t => new { t.AnnouncementId, t.Role }).IsUnique();
    });
}
