// ── DbContext snippet — Why Choose Us page ────────────────────────────────────
// Add these DbSet properties and call ConfigureWhyChooseUsPage(modelBuilder)
// from your OnModelCreating override.

using Entities.Models.WhyChooseUs;
using Microsoft.EntityFrameworkCore;

// ── DbSets — paste alongside your existing ones ───────────────────────────────

// public DbSet<WhyChooseUsPageContent> WhyChooseUsPageContent { get; set; }
// public DbSet<WhyChooseUsItem>        WhyChooseUsItems       { get; set; }

// ── OnModelCreating config ────────────────────────────────────────────────────

internal static void ConfigureWhyChooseUsPage(ModelBuilder modelBuilder)
{
    // ── WhyChooseUsPageContent (singleton) ────────────────────────────────────
    modelBuilder.Entity<WhyChooseUsPageContent>(e =>
    {
        e.Property(w => w.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        // One-to-many: WhyChooseUsPageContent → WhyChooseUsItem
        e.HasMany(w => w.Items)
         .WithOne(i => i.WhyChooseUsPageContent)
         .HasForeignKey(i => i.WhyChooseUsPageContentId)
         .OnDelete(DeleteBehavior.Cascade);

        // Seed the singleton row with the default page text
        e.HasData(new WhyChooseUsPageContent
        {
            Id             = 1,
            Tagline        = "The Alber Difference",
            Headline       = "Why Choose Us?",
            Subheadline    = "Adjacent to the Governor's Offices in Kutus, Kirinyaga County — " +
                             "Alber School has been redefining private education in Kenya since 2005. " +
                             "Here's what makes us different.",
            StatStudents   = "2,000+",
            StatEducators  = "120+",
            StatPassRate   = "97%",
            StatActivities = "30+",
            CtaHeadline    = "Ready to Experience It?",
            CtaSubtext     = "Book a campus tour and see the Alber difference first-hand. " +
                             "Adjacent to the Governor's Offices, Kutus, Kirinyaga County.",
            UpdatedAt      = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        });
    });

    // ── WhyChooseUsItem ───────────────────────────────────────────────────────
    modelBuilder.Entity<WhyChooseUsItem>(e =>
    {
        e.Property(i => i.Icon).HasDefaultValue("⭐");
        e.Property(i => i.Color).HasDefaultValue("gold");
        e.Property(i => i.SortOrder).HasDefaultValue(0);
        e.Property(i => i.IsPublished).HasDefaultValue(true);
        e.Property(i => i.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(i => i.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        var seed = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        e.HasData(
            new WhyChooseUsItem
            {
                Id = 1, WhyChooseUsPageContentId = 1,
                Icon = "🏆", Title = "Academic Excellence", Subtitle = "Top Results, Year After Year",
                Description = "Alber School consistently ranks among the top-performing schools in Kirinyaga County. " +
                              "Our dual CBC and Cambridge IGCSE pathways are delivered by subject specialists who hold " +
                              "degrees from Kenya's leading universities and internationally accredited institutions.",
                Stat = "97%", StatLabel = "KCSE Pass Rate",
                Color = "gold", SortOrder = 1, IsPublished = true,
                CreatedAt = seed, UpdatedAt = seed,
            },
            new WhyChooseUsItem
            {
                Id = 2, WhyChooseUsPageContentId = 1,
                Icon = "🏗️", Title = "World-Class Facilities", Subtitle = "Premium Learning Environments",
                Description = "86 air-conditioned smart classrooms, 4 fully-equipped science labs, a 10,000-volume " +
                              "digital library, professional music studios, sprung-floor dance studios, a 25m heated " +
                              "swimming pool, and GPS-tracked transport — all on one campus in Kutus.",
                Stat = "86", StatLabel = "Smart Classrooms",
                Color = "blue", SortOrder = 2, IsPublished = true,
                CreatedAt = seed, UpdatedAt = seed,
            },
            new WhyChooseUsItem
            {
                Id = 3, WhyChooseUsPageContentId = 1,
                Icon = "🎓", Title = "Dual Curriculum Pathways", Subtitle = "CBC & Cambridge IGCSE",
                Description = "We are one of the very few schools in Kirinyaga County offering both the Kenya CBC and " +
                              "Cambridge International IGCSE. Students in Grade 10–12 can choose the pathway that best " +
                              "aligns with their future — national universities or international study abroad.",
                Stat = "2", StatLabel = "Curriculum Pathways",
                Color = "green", SortOrder = 3, IsPublished = true,
                CreatedAt = seed, UpdatedAt = seed,
            },
            new WhyChooseUsItem
            {
                Id = 4, WhyChooseUsPageContentId = 1,
                Icon = "🎨", Title = "Holistic Co-Curricular Programme", Subtitle = "Arts, Sports & Community",
                Description = "From national athletics to ABRSM music exams, ballet to Model UN — our co-curricular " +
                              "programme spans 30+ activities across sports, performing arts, community service, and " +
                              "career & technical education. Every learner finds their genius.",
                Stat = "30+", StatLabel = "Co-Curricular Activities",
                Color = "purple", SortOrder = 4, IsPublished = true,
                CreatedAt = seed, UpdatedAt = seed,
            },
            new WhyChooseUsItem
            {
                Id = 5, WhyChooseUsPageContentId = 1,
                Icon = "👩‍🏫", Title = "Expert, Passionate Faculty", Subtitle = "120+ Qualified Educators",
                Description = "Our 120+ teaching staff hold degrees from the University of Nairobi, Kenyatta University, " +
                              "Moi University, and Cambridge-accredited programmes. Many are TSC-registered specialists " +
                              "with 10+ years of classroom experience and a genuine passion for mentorship.",
                Stat = "120+", StatLabel = "Qualified Staff",
                Color = "teal", SortOrder = 5, IsPublished = true,
                CreatedAt = seed, UpdatedAt = seed,
            },
            new WhyChooseUsItem
            {
                Id = 6, WhyChooseUsPageContentId = 1,
                Icon = "🛡️", Title = "Safe & Nurturing Environment", Subtitle = "Where Every Child Thrives",
                Description = "CCTV-monitored campus, a dedicated counselling team, an anti-bullying programme, and a " +
                              "student welfare committee ensure every learner feels safe, seen, and supported. Our inclusive " +
                              "culture celebrates diversity and champions every child's mental health.",
                Stat = "2,000+", StatLabel = "Happy Students",
                Color = "rose", SortOrder = 6, IsPublished = true,
                CreatedAt = seed, UpdatedAt = seed,
            },
            new WhyChooseUsItem
            {
                Id = 7, WhyChooseUsPageContentId = 1,
                Icon = "💰", Title = "Affordable Excellence", Subtitle = "Value That Goes Beyond Fees",
                Description = "We believe premium education should be accessible. Competitive fee structures, merit " +
                              "scholarships, sibling discounts, and flexible payment plans via M-Pesa make an Alber " +
                              "School education a genuine investment — not a barrier — for families across Kirinyaga County.",
                Stat = "15+", StatLabel = "Scholarship Awards Annually",
                Color = "amber", SortOrder = 7, IsPublished = true,
                CreatedAt = seed, UpdatedAt = seed,
            },
            new WhyChooseUsItem
            {
                Id = 8, WhyChooseUsPageContentId = 1,
                Icon = "🤝", Title = "Strong Community & Values", Subtitle = "Rooted in Kirinyaga, Ready for the World",
                Description = "Founded in Kutus in 2005, Alber School is deeply woven into the Kirinyaga community. Our " +
                              "annual cultural festivals, CSL projects, and parent-school partnership programmes build a " +
                              "family where every member — student, parent, and teacher — belongs.",
                Stat = "20+", StatLabel = "Years Serving Kirinyaga",
                Color = "green", SortOrder = 8, IsPublished = true,
                CreatedAt = seed, UpdatedAt = seed,
            }
        );
    });
}
