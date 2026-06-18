// ── DbContext snippet — Facilities page ───────────────────────────────────────
// Add these DbSet properties and call ConfigureFacilitiesPage(modelBuilder)
// from your OnModelCreating override.

using Entities.Models.Facilities;
using Microsoft.EntityFrameworkCore;

// ── DbSets — paste alongside your existing ones ───────────────────────────────

// public DbSet<FacilitiesPageContent> FacilitiesPageContent { get; set; }
// public DbSet<Facility>              Facilities            { get; set; }

// ── OnModelCreating config ────────────────────────────────────────────────────

internal static void ConfigureFacilitiesPage(ModelBuilder modelBuilder)
{
    // ── FacilitiesPageContent (singleton) ─────────────────────────────────────
    modelBuilder.Entity<FacilitiesPageContent>(e =>
    {
        e.Property(f => f.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        // One-to-many: FacilitiesPageContent → Facility
        e.HasMany(f => f.Facilities)
         .WithOne(f => f.FacilitiesPageContent)
         .HasForeignKey(f => f.FacilitiesPageContentId)
         .OnDelete(DeleteBehavior.Cascade);

        // Seed the default singleton row
        e.HasData(new FacilitiesPageContent
        {
            Id          = 1,
            Headline    = "Facilities",
            Subheadline = "World-class infrastructure designed for modern learning — " +
                          "click any facility to explore.",
            CtaHeadline = "Experience It In Person",
            CtaSubtext  = "Book a campus tour and see our facilities first-hand. " +
                          "Adjacent to the Governor's Offices, Kutus.",
            UpdatedAt   = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        });
    });

    // ── Facility ──────────────────────────────────────────────────────────────
    modelBuilder.Entity<Facility>(e =>
    {
        e.Property(f => f.Icon).HasDefaultValue("🏫");
        e.Property(f => f.SortOrder).HasDefaultValue(0);
        e.Property(f => f.IsPublished).HasDefaultValue(true);
        e.Property(f => f.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(f => f.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        var seed = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        e.HasData(
            new Facility
            {
                Id                    = 1,
                Icon                  = "🖥️",
                Name                  = "Smart Classrooms",
                Desc                  = "86 air-conditioned smart classrooms with interactive whiteboards, " +
                                        "high-speed Wi-Fi, and ergonomic furniture designed for CBC and IGCSE learning.",
                Img                   = "https://picsum.photos/seed/facility-classroom/800/600",
                Highlights            = "Interactive whiteboards\nHigh-speed fibre internet\nAir-conditioned\nCCTV monitored",
                SortOrder             = 1,
                IsPublished           = true,
                FacilitiesPageContentId = 1,
                CreatedAt             = seed,
                UpdatedAt             = seed,
            },
            new Facility
            {
                Id                    = 2,
                Icon                  = "🎵",
                Name                  = "Music Studio",
                Desc                  = "Professional music studios with Steinway-ready piano rooms, acoustic-treated " +
                                        "recording booths, ensemble rehearsal halls, and an ABRSM examination centre.",
                Img                   = "https://picsum.photos/seed/facility-music/800/600",
                Highlights            = "Piano rooms\nRecording booth\nEnsemble hall\nABRSM centre",
                SortOrder             = 2,
                IsPublished           = true,
                FacilitiesPageContentId = 1,
                CreatedAt             = seed,
                UpdatedAt             = seed,
            },
            new Facility
            {
                Id                    = 3,
                Icon                  = "🩰",
                Name                  = "Dance Studio",
                Desc                  = "Full-wall mirrors, sprung wooden floors, professional lighting rigs, " +
                                        "and 4K capture systems for portfolio development and performance recording.",
                Img                   = "https://picsum.photos/seed/facility-dance/800/600",
                Highlights            = "Sprung floors\nFull-wall mirrors\nProfessional lighting\n4K recording",
                SortOrder             = 3,
                IsPublished           = true,
                FacilitiesPageContentId = 1,
                CreatedAt             = seed,
                UpdatedAt             = seed,
            },
            new Facility
            {
                Id                    = 4,
                Icon                  = "🏟️",
                Name                  = "Sports Complex",
                Desc                  = "Premium sports complex with two football pitches, basketball and volleyball courts, " +
                                        "25m swimming pool, 400m athletics track, and a fully equipped gym.",
                Img                   = "https://picsum.photos/seed/facility-sports/800/600",
                Highlights            = "25m swimming pool\nFootball pitches\nAthletics track\nFully equipped gym",
                SortOrder             = 4,
                IsPublished           = true,
                FacilitiesPageContentId = 1,
                CreatedAt             = seed,
                UpdatedAt             = seed,
            },
            new Facility
            {
                Id                    = 5,
                Icon                  = "📚",
                Name                  = "Digital Library",
                Desc                  = "A 10,000-volume library with digital cataloguing, quiet study rooms, " +
                                        "a maker space, and access to global online databases and journals.",
                Img                   = "https://picsum.photos/seed/facility-library/800/600",
                Highlights            = "10,000+ volumes\nDigital catalogue\nStudy rooms\nOnline database access",
                SortOrder             = 5,
                IsPublished           = true,
                FacilitiesPageContentId = 1,
                CreatedAt             = seed,
                UpdatedAt             = seed,
            },
            new Facility
            {
                Id                    = 6,
                Icon                  = "🍽️",
                Name                  = "Dining Hall",
                Desc                  = "Spacious dining hall serving 600 students per sitting. Balanced, " +
                                        "nutritionist-approved menus with halal, vegetarian, and allergy-aware options.",
                Img                   = "https://picsum.photos/seed/facility-dining/800/600",
                Highlights            = "600-seat capacity\nNutritionist menus\nHalal & vegetarian\nAllergy-aware",
                SortOrder             = 6,
                IsPublished           = true,
                FacilitiesPageContentId = 1,
                CreatedAt             = seed,
                UpdatedAt             = seed,
            },
            new Facility
            {
                Id                    = 7,
                Icon                  = "🚌",
                Name                  = "School Buses",
                Desc                  = "Eight modern, GPS-tracked school buses covering Kutus, Kerugoya, Sagana, " +
                                        "Kagio, Kagumo, Kianyaga, Mutira, and Ngariama routes.",
                Img                   = "https://picsum.photos/seed/facility-buses/800/600",
                Highlights            = "8 buses\nGPS tracked\n8 routes\nLicensed drivers",
                SortOrder             = 7,
                IsPublished           = true,
                FacilitiesPageContentId = 1,
                CreatedAt             = seed,
                UpdatedAt             = seed,
            },
            new Facility
            {
                Id                    = 8,
                Icon                  = "🔬",
                Name                  = "Science Laboratories",
                Desc                  = "Four dedicated labs — Biology, Chemistry, Physics, and Computer Science — " +
                                        "equipped for KNEC and Cambridge IGCSE practical examinations.",
                Img                   = "https://picsum.photos/seed/facility-science/800/600",
                Highlights            = "Biology lab\nChemistry lab\nPhysics lab\nComputer science lab",
                SortOrder             = 8,
                IsPublished           = true,
                FacilitiesPageContentId = 1,
                CreatedAt             = seed,
                UpdatedAt             = seed,
            }
        );
    });
}
