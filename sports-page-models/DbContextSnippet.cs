// ── DbContext snippet — Sports page ──────────────────────────────────────────
// Add these DbSet properties and call ConfigureSportsPage(modelBuilder)
// from your OnModelCreating override.

using Entities.Models.Sports;
using Microsoft.EntityFrameworkCore;

// ── DbSets — paste alongside your existing ones ───────────────────────────────

// public DbSet<SportsPageContent> SportsPageContent { get; set; }
// public DbSet<SportOffered>      SportsOffered     { get; set; }
// public DbSet<SportTrophy>       SportTrophies     { get; set; }
// public DbSet<SportFixture>      SportFixtures     { get; set; }
// public DbSet<PlayerOfMonth>     PlayerSpotlights  { get; set; }

// ── OnModelCreating config ────────────────────────────────────────────────────

internal static void ConfigureSportsPage(ModelBuilder modelBuilder)
{
    var seed = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    // ── SportsPageContent (singleton) ─────────────────────────────────────────
    modelBuilder.Entity<SportsPageContent>(e =>
    {
        e.Property(s => s.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        e.HasMany(s => s.SportsOffered)
         .WithOne(s => s.SportsPageContent)
         .HasForeignKey(s => s.SportsPageContentId)
         .OnDelete(DeleteBehavior.Cascade);

        e.HasMany(s => s.Trophies)
         .WithOne(t => t.SportsPageContent)
         .HasForeignKey(t => t.SportsPageContentId)
         .OnDelete(DeleteBehavior.Cascade);

        e.HasMany(s => s.Fixtures)
         .WithOne(f => f.SportsPageContent)
         .HasForeignKey(f => f.SportsPageContentId)
         .OnDelete(DeleteBehavior.Cascade);

        e.HasMany(s => s.PlayerSpotlights)
         .WithOne(p => p.SportsPageContent)
         .HasForeignKey(p => p.SportsPageContentId)
         .OnDelete(DeleteBehavior.Cascade);

        e.HasData(new SportsPageContent
        {
            Id          = 1,
            Headline    = "Sports & Athletics",
            Subheadline = "Premium facilities · Professional coaching · County, regional and national competition.",
            UpdatedAt   = seed,
        });
    });

    // ── SportOffered ──────────────────────────────────────────────────────────
    modelBuilder.Entity<SportOffered>(e =>
    {
        e.Property(s => s.Icon).HasDefaultValue("🏅");
        e.Property(s => s.SortOrder).HasDefaultValue(0);
        e.Property(s => s.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(s => s.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        e.HasData(
            new SportOffered { Id = 1, Icon = "⚽", Name = "Football",   Desc = "Two pitches, inter-house and inter-school leagues, dedicated coaching staff.",             SortOrder = 1, SportsPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new SportOffered { Id = 2, Icon = "🏀", Name = "Basketball", Desc = "Full-size courts. Boys and girls teams competing regionally.",                             SortOrder = 2, SportsPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new SportOffered { Id = 3, Icon = "🏐", Name = "Volleyball", Desc = "Indoor and outdoor courts for both competitive and recreational play.",                    SortOrder = 3, SportsPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new SportOffered { Id = 4, Icon = "🏃", Name = "Athletics",  Desc = "400m track, field events, relay squads — training five days a week.",                     SortOrder = 4, SportsPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new SportOffered { Id = 5, Icon = "🏊", Name = "Swimming",   Desc = "25m heated pool with certified coaches and county-level competition.",                     SortOrder = 5, SportsPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new SportOffered { Id = 6, Icon = "🎾", Name = "Tennis",     Desc = "Two courts for individual and doubles coaching from juniors upward.",                     SortOrder = 6, SportsPageContentId = 1, CreatedAt = seed, UpdatedAt = seed }
        );
    });

    // ── SportTrophy ───────────────────────────────────────────────────────────
    modelBuilder.Entity<SportTrophy>(e =>
    {
        e.Property(t => t.SortOrder).HasDefaultValue(0);
        e.Property(t => t.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(t => t.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        e.HasData(
            new SportTrophy { Id = 1, Year = "2025", Title = "Kirinyaga County Football Champions",        Category = "Football",   SortOrder = 1, SportsPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new SportTrophy { Id = 2, Year = "2025", Title = "Regional Athletics — Gold (4×100m Relay)",   Category = "Athletics",  SortOrder = 2, SportsPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new SportTrophy { Id = 3, Year = "2024", Title = "Inter-School Basketball — Boys Division",     Category = "Basketball", SortOrder = 3, SportsPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new SportTrophy { Id = 4, Year = "2024", Title = "Swimming Championships — 3 Gold Medals",      Category = "Swimming",   SortOrder = 4, SportsPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new SportTrophy { Id = 5, Year = "2023", Title = "National Volleyball — Semi-finalists",        Category = "Volleyball", SortOrder = 5, SportsPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new SportTrophy { Id = 6, Year = "2023", Title = "County Cross Country Champions",              Category = "Athletics",  SortOrder = 6, SportsPageContentId = 1, CreatedAt = seed, UpdatedAt = seed }
        );
    });

    // ── SportFixture ──────────────────────────────────────────────────────────
    modelBuilder.Entity<SportFixture>(e =>
    {
        e.Property(f => f.Result).HasDefaultValue("—");
        e.Property(f => f.Status).HasConversion<string>(); // store as "Upcoming" | "Live" | "Completed"
        e.Property(f => f.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(f => f.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        e.HasData(
            new SportFixture { Id = 1, Sport = "Football",   Opponent = "St. Annes Academy",    Date = "2026-03-20", Venue = "Home",          Result = "3-1",    Status = FixtureStatus.Completed, SportsPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new SportFixture { Id = 2, Sport = "Rugby",      Opponent = "Alliance High",         Date = "2026-03-25", Venue = "Away",          Result = "—",      Status = FixtureStatus.Upcoming,  SportsPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new SportFixture { Id = 3, Sport = "Swimming",   Opponent = "County Championships",  Date = "2026-03-22", Venue = "Aquatic Centre",Result = "Live",   Status = FixtureStatus.Live,      SportsPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new SportFixture { Id = 4, Sport = "Basketball", Opponent = "Green Valley School",   Date = "2026-04-02", Venue = "Home",          Result = "—",      Status = FixtureStatus.Upcoming,  SportsPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new SportFixture { Id = 5, Sport = "Athletics",  Opponent = "Regional Meet",         Date = "2026-03-15", Venue = "Sports Complex", Result = "12 Gold",Status = FixtureStatus.Completed, SportsPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new SportFixture { Id = 6, Sport = "Tennis",     Opponent = "Hillcrest Prep",        Date = "2026-04-10", Venue = "Away",          Result = "—",      Status = FixtureStatus.Upcoming,  SportsPageContentId = 1, CreatedAt = seed, UpdatedAt = seed }
        );
    });

    // ── PlayerOfMonth ─────────────────────────────────────────────────────────
    modelBuilder.Entity<PlayerOfMonth>(e =>
    {
        e.Property(p => p.IsActive).HasDefaultValue(true);
        e.Property(p => p.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(p => p.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        e.HasData(
            new PlayerOfMonth
            {
                Id                 = 1,
                Name               = "Brian Mutua",
                Sport              = "Football",
                Class              = "Form 3 Ruby",
                Image              = "https://i.pravatar.cc/600?img=12",
                Stats              = "14 goals · 8 assists · Captain",
                IsActive           = true,
                SportsPageContentId = 1,
                CreatedAt          = seed,
                UpdatedAt          = seed,
            }
        );
    });
}
