// ── DbContext snippet — Music page ────────────────────────────────────────────
// Add these DbSet properties and call ConfigureMusicPage(modelBuilder)
// from your OnModelCreating override.

using Entities.Models.Music;
using Microsoft.EntityFrameworkCore;

// ── DbSets — paste alongside your existing ones ───────────────────────────────

// public DbSet<MusicPageContent>   MusicPageContent  { get; set; }
// public DbSet<MusicInstrument>    MusicInstruments  { get; set; }
// public DbSet<MusicTeacher>       MusicTeachers     { get; set; }
// public DbSet<MusicScheduleSlot>  MusicSchedule     { get; set; }

// ── OnModelCreating config ────────────────────────────────────────────────────

internal static void ConfigureMusicPage(ModelBuilder modelBuilder)
{
    var seed = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    // ── MusicPageContent (singleton) ──────────────────────────────────────────
    modelBuilder.Entity<MusicPageContent>(e =>
    {
        e.Property(m => m.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        e.HasMany(m => m.Instruments)
         .WithOne(i => i.MusicPageContent)
         .HasForeignKey(i => i.MusicPageContentId)
         .OnDelete(DeleteBehavior.Cascade);

        e.HasMany(m => m.Teachers)
         .WithOne(t => t.MusicPageContent)
         .HasForeignKey(t => t.MusicPageContentId)
         .OnDelete(DeleteBehavior.Cascade);

        e.HasMany(m => m.ScheduleSlots)
         .WithOne(s => s.MusicPageContent)
         .HasForeignKey(s => s.MusicPageContentId)
         .OnDelete(DeleteBehavior.Cascade);

        e.HasData(new MusicPageContent
        {
            Id          = 1,
            Headline    = "Music Academy",
            Subheadline = "Piano studios · Recording suites · Full orchestra ensemble · ABRSM examination centre.",
            UpdatedAt   = seed,
        });
    });

    // ── MusicInstrument ───────────────────────────────────────────────────────
    modelBuilder.Entity<MusicInstrument>(e =>
    {
        e.Property(i => i.Icon).HasDefaultValue("🎵");
        e.Property(i => i.SortOrder).HasDefaultValue(0);
        e.Property(i => i.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(i => i.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        e.HasData(
            new MusicInstrument { Id = 1, Icon = "🎹", Name = "Piano",               Desc = "Steinway-ready studios. Lessons from beginner to Grade 8 ABRSM.",               SortOrder = 1, MusicPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new MusicInstrument { Id = 2, Icon = "🎻", Name = "Violin",              Desc = "Classical strings with ensemble and solo performance training.",                  SortOrder = 2, MusicPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new MusicInstrument { Id = 3, Icon = "🎸", Name = "Guitar",              Desc = "Acoustic, classical and electric — across all skill levels.",                    SortOrder = 3, MusicPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new MusicInstrument { Id = 4, Icon = "🎺", Name = "Brass",               Desc = "Trumpet, trombone, French horn — full brass section ensemble.",                  SortOrder = 4, MusicPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new MusicInstrument { Id = 5, Icon = "🎷", Name = "Woodwind",            Desc = "Flute, clarinet, saxophone — individual and band sessions.",                     SortOrder = 5, MusicPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new MusicInstrument { Id = 6, Icon = "🥁", Name = "Drums & Percussion",  Desc = "Full kit, djembe, marimba and orchestral percussion.",                           SortOrder = 6, MusicPageContentId = 1, CreatedAt = seed, UpdatedAt = seed }
        );
    });

    // ── MusicTeacher ──────────────────────────────────────────────────────────
    modelBuilder.Entity<MusicTeacher>(e =>
    {
        e.Property(t => t.SortOrder).HasDefaultValue(0);
        e.Property(t => t.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(t => t.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        e.HasData(
            new MusicTeacher { Id = 1, Name = "Ms. Ruth Kamau",   Subject = "Piano & Theory",      Img = "https://i.pravatar.cc/400?img=44", Credentials = "B.Mus (University of Nairobi) · ABRSM Grade 8",    SortOrder = 1, MusicPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new MusicTeacher { Id = 2, Name = "Mr. Victor Omondi",Subject = "Strings & Ensemble",   Img = "https://i.pravatar.cc/400?img=57", Credentials = "Conservatoire-trained · 12 years teaching",          SortOrder = 2, MusicPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new MusicTeacher { Id = 3, Name = "Ms. Nancy Wanjiru", Subject = "Vocals & Choir",      Img = "https://i.pravatar.cc/400?img=32", Credentials = "Dip. Music Ed. · Former KBC choir director",         SortOrder = 3, MusicPageContentId = 1, CreatedAt = seed, UpdatedAt = seed }
        );
    });

    // ── MusicScheduleSlot ─────────────────────────────────────────────────────
    modelBuilder.Entity<MusicScheduleSlot>(e =>
    {
        e.Property(s => s.SortOrder).HasDefaultValue(0);
        e.Property(s => s.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(s => s.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Slots is a newline-separated string. Split on '\n' before rendering list items.
        e.HasData(
            new MusicScheduleSlot { Id = 1, Day = "Monday",    Slots = "Piano — 3:30–5:00 PM\nChoir Rehearsal — 4:00–5:30 PM",         SortOrder = 1, MusicPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new MusicScheduleSlot { Id = 2, Day = "Tuesday",   Slots = "Strings Ensemble — 3:30–5:00 PM\nGuitar — 4:00–5:00 PM",       SortOrder = 2, MusicPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new MusicScheduleSlot { Id = 3, Day = "Wednesday", Slots = "Brass & Woodwind — 3:30–5:00 PM\nTheory of Music — 4:00–5:00 PM", SortOrder = 3, MusicPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new MusicScheduleSlot { Id = 4, Day = "Thursday",  Slots = "Drums & Percussion — 3:30–5:00 PM\nFull Orchestra — 4:00–6:00 PM", SortOrder = 4, MusicPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new MusicScheduleSlot { Id = 5, Day = "Friday",    Slots = "Open Studio — 3:30–5:30 PM\nSolo Coaching (by appointment)",    SortOrder = 5, MusicPageContentId = 1, CreatedAt = seed, UpdatedAt = seed }
        );
    });
}
