// ── DbContext snippet — About page ────────────────────────────────────────────
// Add these DbSet properties and call ConfigureAboutPage(modelBuilder)
// from your OnModelCreating override.

using Entities.Models.About;
using Microsoft.EntityFrameworkCore;

// ── DbSets — paste alongside your existing ones ───────────────────────────────

// public DbSet<AboutPageContent>  AboutPageContent  { get; set; }
// public DbSet<CoreValue>         CoreValues        { get; set; }
// public DbSet<HistoryMilestone>  HistoryMilestones { get; set; }

// ── OnModelCreating config ────────────────────────────────────────────────────

internal static void ConfigureAboutPage(ModelBuilder modelBuilder)
{
    // ── AboutPageContent (singleton) ──────────────────────────────────────────
    modelBuilder.Entity<AboutPageContent>(e =>
    {
        e.Property(a => a.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Seed the default row so GET /api/about/page-content always returns data.
        e.HasData(new AboutPageContent
        {
            Id           = 1,
            Headline     = "About Us",
            Subheadline  = "Adjacent to the Governor's Offices in Kutus, Kirinyaga County — " +
                           "redefining private education in Kenya since 2005.",
            Mission      = "To cultivate visionary leaders through innovative, competency-based " +
                           "education that honours Kenyan heritage while embracing global excellence. " +
                           "We nurture every learner's genius — academically, artistically, and athletically.",
            Vision       = "To be East Africa's most sought-after private institution — where every " +
                           "learner discovers their genius in world-class facilities, guided by expert " +
                           "educators who inspire curiosity and ambition in equal measure.",
            HistoryIntro = "Two decades of excellence — from a single campus in Kutus to Kirinyaga's " +
                           "premier educational institution.",
            UpdatedAt    = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        });
    });

    // ── CoreValue ─────────────────────────────────────────────────────────────
    modelBuilder.Entity<CoreValue>(e =>
    {
        e.Property(c => c.Icon).HasDefaultValue("⭐");
        e.Property(c => c.SortOrder).HasDefaultValue(0);
        e.Property(c => c.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(c => c.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Seed the default core values
        e.HasData(
            new CoreValue { Id = 1, Icon = "🎓", Title = "Academic Excellence", Description = "Rigorous standards across CBC and Cambridge IGCSE frameworks with continuous assessment.", SortOrder = 1, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new CoreValue { Id = 2, Icon = "🤝", Title = "Integrity",            Description = "Honesty and ethical conduct are the foundation of every interaction in our community.",     SortOrder = 2, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new CoreValue { Id = 3, Icon = "🌍", Title = "Global Citizenship",  Description = "Celebrating Kenyan heritage while preparing learners for a connected, diverse world.",        SortOrder = 3, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new CoreValue { Id = 4, Icon = "💡", Title = "Innovation",           Description = "Encouraging curiosity, creativity, and problem-solving across all disciplines.",              SortOrder = 4, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new CoreValue { Id = 5, Icon = "🏆", Title = "Holistic Growth",      Description = "Developing the whole child — academically, physically, artistically, and emotionally.",      SortOrder = 5, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new CoreValue { Id = 6, Icon = "🌱", Title = "Sustainability",        Description = "Stewardship of our community and environment for future generations.",                        SortOrder = 6, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );
    });

    // ── HistoryMilestone ──────────────────────────────────────────────────────
    modelBuilder.Entity<HistoryMilestone>(e =>
    {
        e.Property(h => h.SortOrder).HasDefaultValue(0);
        e.Property(h => h.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(h => h.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Seed the default timeline milestones
        e.HasData(
            new HistoryMilestone { Id = 1, Year = "2005", Title = "Foundation",        Description = "Alber School established in Kutus, Kirinyaga County, with a bold vision to deliver premium education adjacent to the Governor's Offices.", SortOrder = 1, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new HistoryMilestone { Id = 2, Year = "2010", Title = "Primary Expansion", Description = "Full primary school opened with 400 students. CBC-aligned curriculum launched alongside dedicated science laboratories.",                    SortOrder = 2, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new HistoryMilestone { Id = 3, Year = "2014", Title = "Arts Academy",      Description = "Music studios, drama theatre, and dance halls launched — the first dedicated performing arts complex in Kirinyaga County.",                  SortOrder = 3, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new HistoryMilestone { Id = 4, Year = "2018", Title = "IGCSE Pathway",     Description = "Cambridge international curriculum introduced, giving students a globally recognised academic pathway from Grade 10.",                        SortOrder = 4, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new HistoryMilestone { Id = 5, Year = "2022", Title = "Sports Complex",    Description = "New sports complex completed — football pitch, basketball courts, swimming pool, and athletics track.",                                      SortOrder = 5, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new HistoryMilestone { Id = 6, Year = "2026", Title = "Digital Frontier",  Description = "360° virtual tours, smart classrooms, and digital learning platforms launched. 2,000+ students, 120+ staff.",                               SortOrder = 6, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );
    });
}
