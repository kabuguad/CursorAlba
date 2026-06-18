// ── DbContext snippet — Drama & Dance page ────────────────────────────────────
// Add these DbSet properties and call ConfigureDramaPage(modelBuilder)
// from your OnModelCreating override.

using Entities.Models.Drama;
using Microsoft.EntityFrameworkCore;

// ── DbSets — paste alongside your existing ones ───────────────────────────────

// public DbSet<DramaDancePageContent> DramaDancePageContent { get; set; }
// public DbSet<DanceStyle>            DanceStyles           { get; set; }
// public DbSet<DramaPlay>             DramaPlays            { get; set; }
// public DbSet<DramaFaculty>          DramaFaculty          { get; set; }
// public DbSet<DramaScheduleSlot>     DramaSchedule         { get; set; }

// ── OnModelCreating config ────────────────────────────────────────────────────

internal static void ConfigureDramaPage(ModelBuilder modelBuilder)
{
    var seed = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    // ── DramaDancePageContent (singleton) ─────────────────────────────────────
    modelBuilder.Entity<DramaDancePageContent>(e =>
    {
        e.Property(d => d.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        e.HasMany(d => d.DanceStyles)
         .WithOne(s => s.DramaDancePageContent)
         .HasForeignKey(s => s.DramaDancePageContentId)
         .OnDelete(DeleteBehavior.Cascade);

        e.HasMany(d => d.Plays)
         .WithOne(p => p.DramaDancePageContent)
         .HasForeignKey(p => p.DramaDancePageContentId)
         .OnDelete(DeleteBehavior.Cascade);

        e.HasMany(d => d.Faculty)
         .WithOne(f => f.DramaDancePageContent)
         .HasForeignKey(f => f.DramaDancePageContentId)
         .OnDelete(DeleteBehavior.Cascade);

        e.HasMany(d => d.ScheduleSlots)
         .WithOne(s => s.DramaDancePageContent)
         .HasForeignKey(s => s.DramaDancePageContentId)
         .OnDelete(DeleteBehavior.Cascade);

        e.HasData(new DramaDancePageContent
        {
            Id          = 1,
            Headline    = "Drama & Dance",
            Subheadline = "Mirror-walled studios · Professional lighting · Sprung floors · 4K capture for portfolio development.",
            UpdatedAt   = seed,
        });
    });

    // ── DanceStyle ────────────────────────────────────────────────────────────
    modelBuilder.Entity<DanceStyle>(e =>
    {
        e.Property(s => s.Icon).HasDefaultValue("💃");
        e.Property(s => s.SortOrder).HasDefaultValue(0);
        e.Property(s => s.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(s => s.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        e.HasData(
            new DanceStyle { Id = 1, Style = "Ballet",       Icon = "🩰", Desc = "Classical technique from foundational positions to pointe work.",    SortOrder = 1, DramaDancePageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new DanceStyle { Id = 2, Style = "Contemporary", Icon = "💫", Desc = "Fluid movement, floor work, and creative improvisation.",             SortOrder = 2, DramaDancePageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new DanceStyle { Id = 3, Style = "African Dance", Icon = "🥁", Desc = "Traditional rhythms from across East and West Africa.",              SortOrder = 3, DramaDancePageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new DanceStyle { Id = 4, Style = "Hip-Hop",      Icon = "🎤", Desc = "Street styles, breaking, and performance choreography.",              SortOrder = 4, DramaDancePageContentId = 1, CreatedAt = seed, UpdatedAt = seed }
        );
    });

    // ── DramaPlay ─────────────────────────────────────────────────────────────
    modelBuilder.Entity<DramaPlay>(e =>
    {
        e.Property(p => p.SortOrder).HasDefaultValue(0);
        e.Property(p => p.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(p => p.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        e.HasData(
            new DramaPlay { Id = 1, Year = "2024", Title = "The Lion's Roar",      Desc = "An original production exploring Kenyan folklore through dance, spoken word, and music. Cast of 60 students.",               Img = "https://picsum.photos/seed/drama-2024/600/400", SortOrder = 1, DramaDancePageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new DramaPlay { Id = 2, Year = "2023", Title = "Echoes of Kirinyaga",  Desc = "A celebration of Kirinyaga County heritage with traditional dance, acrobatics, and drama. Standing ovation.",                Img = "https://picsum.photos/seed/drama-2023/600/400", SortOrder = 2, DramaDancePageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new DramaPlay { Id = 3, Year = "2022", Title = "Tomorrow's Leaders",   Desc = "A satirical play on modern education and youth ambition. Directed by Form 4 students.",                                      Img = "https://picsum.photos/seed/drama-2022/600/400", SortOrder = 3, DramaDancePageContentId = 1, CreatedAt = seed, UpdatedAt = seed }
        );
    });

    // ── DramaFaculty ──────────────────────────────────────────────────────────
    modelBuilder.Entity<DramaFaculty>(e =>
    {
        e.Property(f => f.SortOrder).HasDefaultValue(0);
        e.Property(f => f.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(f => f.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        e.HasData(
            new DramaFaculty { Id = 1, Name = "Ms. Grace Achieng", Role = "Lead Choreographer · Ballet & Contemporary", Img = "https://i.pravatar.cc/400?img=36", Bio = "Trained in Nairobi and London. 15 years choreographing award-winning productions.", SortOrder = 1, DramaDancePageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new DramaFaculty { Id = 2, Name = "Mr. Oscar Njoroge",  Role = "Drama Director · Playwright",               Img = "https://i.pravatar.cc/400?img=52", Bio = "Graduate of Kenya National Theatre. Specialist in African contemporary drama.",        SortOrder = 2, DramaDancePageContentId = 1, CreatedAt = seed, UpdatedAt = seed }
        );
    });

    // ── DramaScheduleSlot ─────────────────────────────────────────────────────
    modelBuilder.Entity<DramaScheduleSlot>(e =>
    {
        e.Property(s => s.SortOrder).HasDefaultValue(0);
        e.Property(s => s.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(s => s.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        e.HasData(
            new DramaScheduleSlot { Id = 1, Day = "Monday",    Activity = "Ballet — 4:00–5:30 PM",                    SortOrder = 1, DramaDancePageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new DramaScheduleSlot { Id = 2, Day = "Tuesday",   Activity = "Drama Workshop — 3:30–5:30 PM",            SortOrder = 2, DramaDancePageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new DramaScheduleSlot { Id = 3, Day = "Wednesday", Activity = "Contemporary Dance — 4:00–5:30 PM",        SortOrder = 3, DramaDancePageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new DramaScheduleSlot { Id = 4, Day = "Thursday",  Activity = "African Dance & Hip-Hop — 3:30–5:00 PM",  SortOrder = 4, DramaDancePageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new DramaScheduleSlot { Id = 5, Day = "Friday",    Activity = "Full Company Rehearsal — 3:30–6:00 PM",    SortOrder = 5, DramaDancePageContentId = 1, CreatedAt = seed, UpdatedAt = seed }
        );
    });
}
