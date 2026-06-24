// ── DbContext snippet — Home page ──────────────────────────────────────────────
// Add the DbSet property and call ConfigureHomePage(modelBuilder)
// from your OnModelCreating override.

using Entities.Models.Home;
using Microsoft.EntityFrameworkCore;

// ── DbSet — paste alongside your existing ones ────────────────────────────────

// public DbSet<HomePageContent> HomePageContent { get; set; }

// ── OnModelCreating config ────────────────────────────────────────────────────

internal static void ConfigureHomePage(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<HomePageContent>(e =>
    {
        e.Property(h => h.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Seed the default row so GET /api/home/page-content always returns data.
        e.HasData(new HomePageContent
        {
            Id = 1,

            // ── Hero — slideshow images ────────────────────────────────────────
            HeroImage1Url = "https://picsum.photos/seed/alber-campus/1400/900",
            HeroImage2Url = "https://picsum.photos/seed/alber-class/1400/900",
            HeroImage3Url = "https://picsum.photos/seed/alber-sports/1400/900",
            HeroImage4Url = "https://picsum.photos/seed/alber-arts/1400/900",

            // ── Hero — headline & body ─────────────────────────────────────────
            HeroTagline       = "Where Excellence",
            HeroTaglineGold   = "Meets Tomorrow",
            HeroLocationBadge = "Kutus · Kirinyaga County · Est. 2005",
            HeroSubtitle      = "Kenya's premier learning institution — where every learner " +
                                "discovers their genius in world-class facilities guided by " +
                                "expert educators.",

            // ── Hero — CTA buttons ─────────────────────────────────────────────
            HeroPrimaryCtaLabel   = "Apply Now",
            HeroPrimaryCtaUrl     = "/admissions",
            HeroSecondaryCtaLabel = "Explore Programs",
            HeroSecondaryCtaUrl   = "/academics",

            // ── Hero — stats bar ───────────────────────────────────────────────
            StatStudentsEnrolled = 2000,
            StatEducators        = 120,
            StatEstYear          = 2005,
            StatActivities       = 30,

            // ── Foundation section ─────────────────────────────────────────────
            FoundationSectionLabel = "Our Foundation",
            FoundationHeading      = "What We Stand For",

            MissionLabel = "Our Mission",
            MissionTitle = "To Nurture Genius",
            MissionBody  = "World-class, holistic education that unlocks the unique genius in " +
                           "every child — equipping learners with knowledge, skills, and values " +
                           "to thrive globally.",

            MottoLabel   = "Our Motto",
            MottoTitle   = "Excellence in All",
            MottoTagline = "Unlocking Every Child's Genius",
            MottoBody    = "Academic, character, creativity, sport, and service — every learner " +
                           "known, valued, and challenged.",

            VisionLabel = "Our Vision",
            VisionTitle = "Leaders for Tomorrow",
            VisionBody  = "East Africa's leading centre of excellence — producing confident, " +
                          "compassionate, globally competitive graduates who lead with integrity.",

            // ── Final CTA section ──────────────────────────────────────────────
            CtaBadgeText      = "Applications Open · 2026–2027",
            CtaHeading        = "Ready to Join Alber School?",
            CtaSubtext        = "Applications are open for the 2026/2027 academic year. " +
                                "Limited spaces — secure your child's place today.",
            CtaPrimaryLabel   = "Apply Now",
            CtaPrimaryUrl     = "/admissions",
            CtaSecondaryLabel = "Contact Us",
            CtaSecondaryUrl   = "/contact",

            UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        });
    });
}
