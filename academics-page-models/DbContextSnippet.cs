// ── DbContext snippet — Academics page ───────────────────────────────────────
// Add these DbSet properties and call ConfigureAcademicsPage(modelBuilder)
// from your OnModelCreating override.

using Entities.Models.Academics;
using Microsoft.EntityFrameworkCore;

// ── DbSets — paste alongside your existing ones ───────────────────────────────

// public DbSet<AcademicsPageContent> AcademicsPageContent { get; set; }
// public DbSet<SchoolLevel>          SchoolLevels         { get; set; }
// public DbSet<CbcCompetency>        CbcCompetencies      { get; set; }
// public DbSet<TeachingPillar>       TeachingPillars      { get; set; }

// ── OnModelCreating config ────────────────────────────────────────────────────

internal static void ConfigureAcademicsPage(ModelBuilder modelBuilder)
{
    // ── AcademicsPageContent (singleton) ──────────────────────────────────────
    modelBuilder.Entity<AcademicsPageContent>(e =>
    {
        e.Property(a => a.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        // One-to-many: AcademicsPageContent → SchoolLevel
        e.HasMany(a => a.Levels)
         .WithOne(l => l.AcademicsPageContent)
         .HasForeignKey(l => l.AcademicsPageContentId)
         .OnDelete(DeleteBehavior.Cascade);

        // Seed the default singleton row
        e.HasData(new AcademicsPageContent
        {
            Id          = 1,
            Headline    = "Programs & Academics",
            Subheadline = "From Playgroup through Senior School — a seamless CBC journey that " +
                          "develops the whole learner across six structured levels.",
            CtaHeadline = "Ready to Enrol?",
            CtaSubtext  = "Applications are open for the 2026 intake across all levels — from " +
                          "Playgroup to Grade 12. Limited spaces remain.",
            UpdatedAt   = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        });
    });

    // ── SchoolLevel ───────────────────────────────────────────────────────────
    modelBuilder.Entity<SchoolLevel>(e =>
    {
        e.HasIndex(l => l.Slug).IsUnique();
        e.Property(l => l.Icon).HasDefaultValue("📚");
        e.Property(l => l.ColorKey).HasDefaultValue("blue");
        e.Property(l => l.SortOrder).HasDefaultValue(0);
        e.Property(l => l.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(l => l.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Seed the six default school levels — all children of the singleton (Id = 1)
        var seed = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        e.HasData(
            new SchoolLevel { Id = 1, AcademicsPageContentId = 1, Slug = "playgroup",     Name = "Playgroup",     Ages = "Ages 2 – 3",                  Icon = "🧸", ColorKey = "pink",   Description = "A warm, nurturing environment that sparks curiosity through play. Children develop social, emotional, and early language skills in our purpose-built Playgroup centre.",           Highlights = "Play-based learning\nStructured routines\nCreative exploration\nSocial development\nMusic & movement\nEarly number sense",                                                                     SortOrder = 1, CreatedAt = seed, UpdatedAt = seed },
            new SchoolLevel { Id = 2, AcademicsPageContentId = 1, Slug = "ecde",          Name = "ECDE",          Ages = "PP1 & PP2 · Ages 4 – 5",       Icon = "🌱", ColorKey = "green",  Description = "Early Childhood Development Education aligned to the CBC framework. PP1 and PP2 build foundational literacy, numeracy, and environmental awareness through structured activities.", Highlights = "Language Activities\nMathematical Activities\nEnvironmental Activities\nPsychomotor & Creative Arts\nReligious Education\nMusic",                                                              SortOrder = 2, CreatedAt = seed, UpdatedAt = seed },
            new SchoolLevel { Id = 3, AcademicsPageContentId = 1, Slug = "lower-primary", Name = "Lower Primary", Ages = "Grades 1 – 3 · Ages 6 – 8",    Icon = "📚", ColorKey = "blue",   Description = "Building core competencies in literacy and numeracy. Learners engage through integrated, activity-based units that connect learning to real-life contexts in Kirinyaga and beyond.",   Highlights = "English\nKiswahili\nMathematics\nIntegrated Science\nSocial Studies\nReligious Education\nCreative Arts\nPhysical Education",                                                                SortOrder = 3, CreatedAt = seed, UpdatedAt = seed },
            new SchoolLevel { Id = 4, AcademicsPageContentId = 1, Slug = "upper-primary", Name = "Upper Primary", Ages = "Grades 4 – 6 · Ages 9 – 11",   Icon = "🔬", ColorKey = "violet", Description = "Deepening competencies across all learning areas. Learners begin exploring Agriculture and are assessed through Continuous Assessment Tests (CATs) each term.",                        Highlights = "English\nKiswahili\nMathematics\nIntegrated Science\nSocial Studies\nAgriculture\nCreative Arts\nPhysical Education\nReligious Education",                                                    SortOrder = 4, CreatedAt = seed, UpdatedAt = seed },
            new SchoolLevel { Id = 5, AcademicsPageContentId = 1, Slug = "junior",        Name = "Junior School", Ages = "Grades 7 – 9 · Ages 12 – 14",  Icon = "🎯", ColorKey = "amber",  Description = "Junior Secondary School introduces career-based learning pathways. Learners in Grade 9 sit the Kenya Junior School Education Assessment (KJSEA).",                                     Highlights = "English\nKiswahili\nMathematics\nIntegrated Science\nSocial Studies\nBusiness Studies\nAgriculture\nPre-Technical Studies\nCreative Arts\nLife Skills",                                       SortOrder = 5, CreatedAt = seed, UpdatedAt = seed },
            new SchoolLevel { Id = 6, AcademicsPageContentId = 1, Slug = "senior",        Name = "Senior School", Ages = "Grades 10 – 12 · Ages 15 – 17", Icon = "🎓", ColorKey = "teal",   Description = "Senior School offers specialised pathways in Sciences, Humanities, STEM, and Arts & Sports. Learners sit the KCSE at the end of Grade 12.",                                          Highlights = "English\nKiswahili\nMathematics\nSciences (Biology/Chemistry/Physics)\nSocial Studies\nBusiness Studies\nComputer Science\nAgriculture\nCreative Arts & Design\nPhysical Education",        SortOrder = 6, CreatedAt = seed, UpdatedAt = seed }
        );
    });

    // ── CbcCompetency ─────────────────────────────────────────────────────────
    modelBuilder.Entity<CbcCompetency>(e =>
    {
        e.Property(c => c.IsFeatured).HasDefaultValue(false);
        e.Property(c => c.SortOrder).HasDefaultValue(0);
        e.Property(c => c.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(c => c.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        var seed = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        e.HasData(
            new CbcCompetency { Id = 1, Icon = "🗣️", Title = "Communication & Collaboration",     Description = "Learners express ideas clearly, listen actively, and work effectively in teams — skills essential in every career and community.",                                        IsFeatured = false, SortOrder = 1, CreatedAt = seed, UpdatedAt = seed },
            new CbcCompetency { Id = 2, Icon = "🧠", Title = "Critical Thinking & Problem Solving", Description = "Structured inquiry, analysis, and creative problem-solving are woven into every subject so learners tackle real challenges with confidence.",                              IsFeatured = false, SortOrder = 2, CreatedAt = seed, UpdatedAt = seed },
            new CbcCompetency { Id = 3, Icon = "💡", Title = "Creativity & Imagination",            Description = "From arts to STEM, learners are challenged to generate original ideas, experiment boldly, and appreciate diverse forms of expression.",                                   IsFeatured = false, SortOrder = 3, CreatedAt = seed, UpdatedAt = seed },
            new CbcCompetency { Id = 4, Icon = "🌍", Title = "Citizenship",                         Description = "Understanding rights, duties, and active community participation builds responsible, patriotic, and globally aware young Kenyans.",                                       IsFeatured = false, SortOrder = 4, CreatedAt = seed, UpdatedAt = seed },
            new CbcCompetency { Id = 5, Icon = "💻", Title = "Digital Literacy",                    Description = "ICT is a cross-cutting element at Alber — from responsible internet use and data privacy to coding and digital content creation.",                                       IsFeatured = false, SortOrder = 5, CreatedAt = seed, UpdatedAt = seed },
            new CbcCompetency { Id = 6, Icon = "📖", Title = "Learning to Learn",                   Description = "Learners develop metacognitive skills — reflection, self-regulation, and adaptability — so they grow continuously throughout life.",                                     IsFeatured = false, SortOrder = 6, CreatedAt = seed, UpdatedAt = seed },
            new CbcCompetency { Id = 7, Icon = "💪", Title = "Self-Efficacy",                       Description = "Building self-confidence, resilience, and a growth mindset ensures every learner believes in their ability to overcome obstacles.",                                       IsFeatured = true,  SortOrder = 7, CreatedAt = seed, UpdatedAt = seed }
        );
    });

    // ── TeachingPillar ────────────────────────────────────────────────────────
    modelBuilder.Entity<TeachingPillar>(e =>
    {
        e.Property(p => p.Gradient).HasDefaultValue("green");
        e.Property(p => p.SortOrder).HasDefaultValue(0);
        e.Property(p => p.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(p => p.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        var seed = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        e.HasData(
            new TeachingPillar { Id = 1, Icon = "🌱", Title = "Holistic Development",        Description = "CBC goes beyond rote learning. Lessons and projects integrate knowledge with life skills, fostering creativity, teamwork, and self-confidence alongside academic excellence.",                                                         Gradient = "green",  SortOrder = 1, CreatedAt = seed, UpdatedAt = seed },
            new TeachingPillar { Id = 2, Icon = "🎯", Title = "Learner-Centred Teaching",    Description = "Teachers at Alber act as facilitators and mentors — guiding learners through project-based and inquiry-based experiences rather than passive content delivery.",                                                                      Gradient = "blue",   SortOrder = 2, CreatedAt = seed, UpdatedAt = seed },
            new TeachingPillar { Id = 3, Icon = "📊", Title = "Continuous Assessment",       Description = "Formative and summative assessments throughout each term replace high-stakes cramming, rewarding skill mastery and reducing exam pressure for every learner.",                                                                         Gradient = "amber",  SortOrder = 3, CreatedAt = seed, UpdatedAt = seed },
            new TeachingPillar { Id = 4, Icon = "🤝", Title = "Parent & Community Engagement", Description = "CBC actively involves parents and the wider Kirinyaga community. Learning extends beyond the classroom — reinforced at home and through community service projects.",                                                              Gradient = "purple", SortOrder = 4, CreatedAt = seed, UpdatedAt = seed }
        );
    });
}
