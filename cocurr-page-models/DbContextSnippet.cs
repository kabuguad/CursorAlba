// ── DbContext snippet — Co-Curricular hub page ────────────────────────────────
// Add these DbSet properties and call ConfigureCocurrPage(modelBuilder)
// from your OnModelCreating override.

using Entities.Models.Cocurr;
using Microsoft.EntityFrameworkCore;

// ── DbSets — paste alongside your existing ones ───────────────────────────────

// public DbSet<CocurrPageContent> CocurrPageContent   { get; set; }
// public DbSet<CocurrCategory>    CocurrCategories    { get; set; }
// public DbSet<CocurrActivity>    CocurrActivities    { get; set; }

// ── OnModelCreating config ────────────────────────────────────────────────────

internal static void ConfigureCocurrPage(ModelBuilder modelBuilder)
{
    var seed = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    // ── CocurrPageContent (singleton) ─────────────────────────────────────────
    modelBuilder.Entity<CocurrPageContent>(e =>
    {
        e.Property(c => c.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        e.HasMany(c => c.Categories)
         .WithOne(c => c.CocurrPageContent)
         .HasForeignKey(c => c.CocurrPageContentId)
         .OnDelete(DeleteBehavior.Cascade);

        e.HasData(new CocurrPageContent
        {
            Id          = 1,
            Headline    = "Co-Curricular",
            Subheadline = "Beyond the classroom — four pillars of holistic development aligned to " +
                          "Kenya's CBC framework and Alber School's vision of whole-learner excellence.",
            CtaHeadline = "Enrich Your Child's Journey",
            CtaSubtext  = "Every learner at Alber participates in co-curricular activities as part of " +
                          "their holistic CBC assessment. Talk to us about pathways that match your child's passions.",
            UpdatedAt   = seed,
        });
    });

    // ── CocurrCategory ────────────────────────────────────────────────────────
    modelBuilder.Entity<CocurrCategory>(e =>
    {
        e.Property(c => c.Icon).HasDefaultValue("⭐");
        e.Property(c => c.SortOrder).HasDefaultValue(0);
        e.Property(c => c.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(c => c.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        e.HasMany(c => c.Activities)
         .WithOne(a => a.Category)
         .HasForeignKey(a => a.CocurrCategoryId)
         .OnDelete(DeleteBehavior.Cascade);

        e.HasData(
            new CocurrCategory { Id = 1, Icon = "🏆", Title = "Sports & Physical",       Heading = "Sports & Physical Activities",                    Intro = "Physical Education is offered to all learners. Senior School students may pursue specialised sports pathways alongside competitive inter-school and national programmes.", SortOrder = 1, CocurrPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new CocurrCategory { Id = 2, Icon = "🎭", Title = "Creative & Performing Arts", Heading = "Creative & Performing Arts",                   Intro = "Music, dance, drama and visual arts are central to learner development at Alber. Artistic and aesthetic competencies are assessed formally as part of the CBC framework.",  SortOrder = 2, CocurrPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new CocurrCategory { Id = 3, Icon = "🤝", Title = "Social & Community",       Heading = "Social, Cultural & Community Activities",         Intro = "Community Service Learning (CSL) builds ethical, moral and civic values. Learners engage with their community and Kenya's rich cultural heritage through structured programmes.", SortOrder = 3, CocurrPageContentId = 1, CreatedAt = seed, UpdatedAt = seed },
            new CocurrCategory { Id = 4, Icon = "⚙️", Title = "Career & Technical",       Heading = "Integrated Career & Technical Activities (CTS)", Intro = "At Senior School level (Grades 10–12), learners engage in practical and vocational options aligned to their interests and potential career paths — fully integrated into the CBC framework.", SortOrder = 4, CocurrPageContentId = 1, CreatedAt = seed, UpdatedAt = seed }
        );
    });

    // ── CocurrActivity ────────────────────────────────────────────────────────
    modelBuilder.Entity<CocurrActivity>(e =>
    {
        e.Property(a => a.Icon).HasDefaultValue("⭐");
        e.Property(a => a.SortOrder).HasDefaultValue(0);
        e.Property(a => a.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        e.Property(a => a.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        e.HasData(
            // ── Sports & Physical (CategoryId = 1) ────────────────────────────
            new CocurrActivity { Id =  1, CocurrCategoryId = 1, Icon = "🏃", Name = "Athletics",                    Desc = "400m track, field events, relay teams and cross-country competing at county and national level.",                                                SortOrder = 1, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id =  2, CocurrCategoryId = 1, Icon = "⚽", Name = "Ball Games",                   Desc = "Football, basketball, volleyball and netball — structured leagues, coaching and inter-school fixtures.",                                         SortOrder = 2, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id =  3, CocurrCategoryId = 1, Icon = "🤸", Name = "Gymnastics",                   Desc = "Floor work, apparatus and rhythmic gymnastics offered through our Physical Education programme.",                                                SortOrder = 3, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id =  4, CocurrCategoryId = 1, Icon = "🥋", Name = "Martial Arts",                 Desc = "Taekwondo and karate offered as both fitness training and competitive discipline.",                                                               SortOrder = 4, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id =  5, CocurrCategoryId = 1, Icon = "🥊", Name = "Boxing",                       Desc = "Supervised boxing and fitness boxing under certified coaches in our dedicated ring.",                                                             SortOrder = 5, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id =  6, CocurrCategoryId = 1, Icon = "🏓", Name = "Indoor Sports",                Desc = "Table tennis, chess, scrabble, and badminton available for all year groups.",                                                                    SortOrder = 6, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id =  7, CocurrCategoryId = 1, Icon = "🏊", Name = "Water Sports",                 Desc = "25m heated pool for competitive swimming, water polo and synchronized swimming.",                                                                SortOrder = 7, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id =  8, CocurrCategoryId = 1, Icon = "⛰️", Name = "Outdoor Pursuits",             Desc = "Hiking, orienteering, camping, and environmental trail activities in Kirinyaga's rolling hills.",                                                SortOrder = 8, CreatedAt = seed, UpdatedAt = seed },

            // ── Creative & Performing Arts (CategoryId = 2) ───────────────────
            new CocurrActivity { Id =  9, CocurrCategoryId = 2, Icon = "🎵", Name = "Music",                        Desc = "Piano, violin, guitar, brass, woodwind, drums and choir. ABRSM examination centre on campus.",                                                   SortOrder = 1, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 10, CocurrCategoryId = 2, Icon = "💃", Name = "Dance",                        Desc = "Ballet, contemporary, African dance and hip-hop taught in our sprung-floor dance studios.",                                                      SortOrder = 2, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 11, CocurrCategoryId = 2, Icon = "🎭", Name = "Drama & Theatre",              Desc = "Annual productions, script writing, stage craft, lighting design and performance portfolios.",                                                   SortOrder = 3, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 12, CocurrCategoryId = 2, Icon = "🎤", Name = "Elocution",                    Desc = "Public speaking, debate, poetry recitation and oratory — internal and national competitions.",                                                   SortOrder = 4, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 13, CocurrCategoryId = 2, Icon = "🎨", Name = "Fine Arts",                    Desc = "Painting, drawing, sculpture and mixed media across all levels with exhibition opportunities.",                                                  SortOrder = 5, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 14, CocurrCategoryId = 2, Icon = "✂️", Name = "Applied Arts",                 Desc = "Textile design, ceramics, graphic design and craft with real-world application.",                                                                SortOrder = 6, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 15, CocurrCategoryId = 2, Icon = "📷", Name = "Visual Arts",                  Desc = "Photography, videography and digital media explored through the lens of creative storytelling.",                                                 SortOrder = 7, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 16, CocurrCategoryId = 2, Icon = "🎬", Name = "Time-Based Media",             Desc = "Film-making, animation and multimedia production for Senior School learners.",                                                                   SortOrder = 8, CreatedAt = seed, UpdatedAt = seed },

            // ── Social & Community (CategoryId = 3) ───────────────────────────
            new CocurrActivity { Id = 17, CocurrCategoryId = 3, Icon = "❤️", Name = "Community Service Learning",  Desc = "Structured CSL projects in Kutus and Kirinyaga County — environmental, health and education initiatives.",                                      SortOrder = 1, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 18, CocurrCategoryId = 3, Icon = "🎼", Name = "Kenya National Music Festival",Desc = "Annual participation exposes learners to diverse cultural instruments and musical traditions from across Kenya.",                                SortOrder = 2, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 19, CocurrCategoryId = 3, Icon = "🪘", Name = "Cultural Festivals",          Desc = "Celebrating Kenyan heritage through food, costume, language, song and storytelling.",                                                            SortOrder = 3, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 20, CocurrCategoryId = 3, Icon = "🌍", Name = "Debate & Model UN",           Desc = "Critical thinking, diplomacy and global awareness through inter-school debate and Model UN simulations.",                                        SortOrder = 4, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 21, CocurrCategoryId = 3, Icon = "🌱", Name = "Environmental Clubs",         Desc = "Sustainability projects including tree planting, recycling drives and solar energy education.",                                                   SortOrder = 5, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 22, CocurrCategoryId = 3, Icon = "🗳️", Name = "Student Council",            Desc = "Elected student leadership developing governance, advocacy and civic responsibility skills.",                                                     SortOrder = 6, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 23, CocurrCategoryId = 3, Icon = "🤲", Name = "Peer Counselling",            Desc = "Trained student peer supporters promoting mental wellbeing and positive school culture.",                                                         SortOrder = 7, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 24, CocurrCategoryId = 3, Icon = "🏅", Name = "Inter-House Competitions",    Desc = "Cross-disciplinary house competitions in academics, sports, arts and community engagement.",                                                     SortOrder = 8, CreatedAt = seed, UpdatedAt = seed },

            // ── Career & Technical (CategoryId = 4) ───────────────────────────
            new CocurrActivity { Id = 25, CocurrCategoryId = 4, Icon = "🏨", Name = "Tourism & Hospitality",       Desc = "Front office operations, tour guiding, event management and customer service fundamentals.",                                                     SortOrder = 1, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 26, CocurrCategoryId = 4, Icon = "👨‍🍳", Name = "Culinary Arts",            Desc = "Food preparation, nutrition, kitchen management and catering for school and community events.",                                               SortOrder = 2, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 27, CocurrCategoryId = 4, Icon = "💇", Name = "Hairdressing & Beauty",       Desc = "Salon skills, cosmetology basics and entrepreneurship for the beauty industry.",                                                                 SortOrder = 3, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 28, CocurrCategoryId = 4, Icon = "🔩", Name = "Welding & Metalwork",         Desc = "Fabrication, welding techniques and basic engineering for technical career pathways.",                                                           SortOrder = 4, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 29, CocurrCategoryId = 4, Icon = "📸", Name = "Photography",                 Desc = "Digital photography, darkroom techniques, editing and commercial photography practice.",                                                         SortOrder = 5, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 30, CocurrCategoryId = 4, Icon = "🪚", Name = "Carpentry & Woodwork",        Desc = "Joinery, furniture making and woodwork design with an entrepreneurship focus.",                                                                  SortOrder = 6, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 31, CocurrCategoryId = 4, Icon = "🌾", Name = "Agriculture",                 Desc = "Crop farming, animal husbandry, agribusiness and sustainable food systems aligned to Kirinyaga's context.",                                     SortOrder = 7, CreatedAt = seed, UpdatedAt = seed },
            new CocurrActivity { Id = 32, CocurrCategoryId = 4, Icon = "💻", Name = "ICT & Digital Projects",      Desc = "Web development, coding, data management, app design and digital entrepreneurship projects.",                                                    SortOrder = 8, CreatedAt = seed, UpdatedAt = seed }
        );
    });
}
