using AlbaApi;
using AlbaApi.Extensions;
using AlbaApi.Presentation;
using AlbaApi.Presentation.ActionFilters;
using Microsoft.EntityFrameworkCore;
using Entities.Models.Academics;
using Entities.Models.Attendance;
using Entities.Models.Content;
using Entities.Models.Finance;
using Entities.Models.Grade;
using Entities.Models.User;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Repository;
using Serilog;
using Service;
using Service.Contracts;
using Service.Contracts.Authentication;
using LoggerService;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, loggerConfiguration) =>
{
    loggerConfiguration.ReadFrom.Configuration(context.Configuration);
});

builder.ConfigureCors();
builder.Services.ConfigureLoggerService();
builder.Services.ConfigureRepositoryManager();
builder.Services.ConfigureServiceManager();
builder.Services.ConfigureSqlContext(builder.Configuration);
builder.Services.ConfigureRateLimitingOptions();

builder.Services.Configure<FormOptions>(options =>
{
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartBodyLengthLimit = 50 * 1024 * 1024;
});

builder.Services.AddAutoMapper(cfg => cfg.AddProfile<Service.Utils.AutoMapperProfile>());

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddScoped<ValidationFilterAttribute>();
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

builder.Services.AddControllers(config =>
{
    config.RespectBrowserAcceptHeader = true;
    config.ReturnHttpNotAcceptable = true;
}).AddNewtonsoftJson()
  .AddApplicationPart(typeof(AssemblyReference).Assembly);

builder.Services.ConfigureIdentity();
builder.Services.ConfigureJwtAuthentication(builder.Configuration);

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddSingleton<IFileUploadService, FileUploadService>();

builder.Services.Configure<Service.JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdmin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("RequireTeacher", policy => policy.RequireRole("Teacher"));
    options.AddPolicy("RequireParent", policy => policy.RequireRole("Parent"));
    options.AddPolicy("RequireStudent", policy => policy.RequireRole("Student"));
});

builder.Services.AddOpenApiDocument(config =>
{
    config.Title = "Alber School API";
    config.Version = "v1";
    config.AddSecurity("JWT", new NSwag.OpenApiSecurityScheme
    {
        Type = NSwag.OpenApiSecuritySchemeType.ApiKey,
        Name = "Authorization",
        In = NSwag.OpenApiSecurityApiKeyLocation.Header,
        Description = "Bearer {token}"
    });
    config.OperationProcessors.Add(new NSwag.Generation.Processors.Security.AspNetCoreOperationSecurityScopeProcessor("JWT"));
});

var app = builder.Build();

app.UseForwardedHeaders(new ForwardedHeadersOptions { ForwardedHeaders = ForwardedHeaders.All });
app.UseExceptionHandler(opt => { });

if (app.Environment.IsDevelopment())
{
    app.UseCors("AllOrigins");
    app.MapOpenApi();
    app.UseOpenApi();
    app.UseSwaggerUi();
}
else
{
    app.UseCors("AllowedOrigins");
    app.UseHsts();
}

app.UseStaticFiles();
app.UseRouting();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

await SeedDatabaseAsync(app);

app.Run();

static async Task SeedDatabaseAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<RepositoryContext>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
    var logger = scope.ServiceProvider.GetRequiredService<ILoggerManager>();

    try
    {
        await context.Database.EnsureCreatedAsync();

        foreach (var role in new[] { "Admin", "Teacher", "Student", "Parent" })
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole<int>(role));
        }

        // ── Site Settings ────────────────────────────────────────────────────────
        if (!await context.SiteSettings.AnyAsync())
        {
            context.SiteSettings.AddRange(
                // Home — Hero
                new SiteSetting { Key = "home.hero.tagline",            Value = "Where Excellence" },
                new SiteSetting { Key = "home.hero.taglineGold",        Value = "Meets Tomorrow" },
                new SiteSetting { Key = "home.hero.subtitle",           Value = "Premium private education in the heart of Kirinyaga. 2,000+ learners, 120+ expert educators — academics, sports, music, and performing arts under one roof." },
                new SiteSetting { Key = "home.hero.directorName",       Value = "Mr. Albert Njeru" },
                new SiteSetting { Key = "home.hero.directorTitle",      Value = "Founder & Director" },
                new SiteSetting { Key = "home.hero.directorCredential", Value = "M.Ed., UoN" },
                new SiteSetting { Key = "home.hero.directorQuote",      Value = "Every child in Kirinyaga deserves an education that changes the trajectory of a family for generations. That is the promise we keep, every single day." },
                // Home — Stats bar
                new SiteSetting { Key = "home.stats.0.label", Value = "Students" },
                new SiteSetting { Key = "home.stats.0.value", Value = "2,000+" },
                new SiteSetting { Key = "home.stats.1.label", Value = "Educators" },
                new SiteSetting { Key = "home.stats.1.value", Value = "120+" },
                new SiteSetting { Key = "home.stats.2.label", Value = "School Buses" },
                new SiteSetting { Key = "home.stats.2.value", Value = "8" },
                new SiteSetting { Key = "home.stats.3.label", Value = "Sports Codes" },
                new SiteSetting { Key = "home.stats.3.value", Value = "12" },
                // Home — Testimonials
                new SiteSetting { Key = "home.testimonials.0.name",  Value = "Grace Njeri" },
                new SiteSetting { Key = "home.testimonials.0.role",  Value = "Parent · Grade 5" },
                new SiteSetting { Key = "home.testimonials.0.quote", Value = "Alber School has transformed my daughter completely. The teaching quality is unmatched anywhere in Kirinyaga County." },
                new SiteSetting { Key = "home.testimonials.1.name",  Value = "Brian Mutua" },
                new SiteSetting { Key = "home.testimonials.1.role",  Value = "Student · Grade 9" },
                new SiteSetting { Key = "home.testimonials.1.quote", Value = "The sports facilities here are world-class. I have grown as both an athlete and a leader since joining Alber." },
                new SiteSetting { Key = "home.testimonials.2.name",  Value = "Dr. Samuel Kariuki" },
                new SiteSetting { Key = "home.testimonials.2.role",  Value = "Parent · PP2 & Grade 7" },
                new SiteSetting { Key = "home.testimonials.2.quote", Value = "Both my children attend Alber. From Playgroup all the way to Senior School — the continuity and quality are simply unmatched in Kirinyaga." },
                new SiteSetting { Key = "home.testimonials.3.name",  Value = "Amina Ochieng" },
                new SiteSetting { Key = "home.testimonials.3.role",  Value = "Student · Music Academy" },
                new SiteSetting { Key = "home.testimonials.3.quote", Value = "I performed my first piano recital here in Grade 5. The music teachers are genuinely world-class professionals." },
                // About — Mission & Vision (exact text from About.tsx)
                new SiteSetting { Key = "about.mission", Value = "To cultivate visionary leaders through innovative, competency-based education that honours Kenyan heritage while embracing global excellence. We nurture every learner's genius — academically, artistically, and athletically." },
                new SiteSetting { Key = "about.vision",  Value = "To be East Africa's most sought-after private institution — where every learner discovers their genius in world-class facilities, guided by expert educators who inspire curiosity and ambition in equal measure." },
                // About — History milestones
                new SiteSetting { Key = "about.history.0.year",  Value = "2005" },
                new SiteSetting { Key = "about.history.0.title", Value = "Foundation" },
                new SiteSetting { Key = "about.history.0.desc",  Value = "Alber School established in Kutus, Kirinyaga County, with a bold vision to deliver premium education adjacent to the Governor's Offices." },
                new SiteSetting { Key = "about.history.1.year",  Value = "2010" },
                new SiteSetting { Key = "about.history.1.title", Value = "Primary Expansion" },
                new SiteSetting { Key = "about.history.1.desc",  Value = "Full primary school opened with 400 students. CBC-aligned curriculum launched alongside dedicated science laboratories." },
                new SiteSetting { Key = "about.history.2.year",  Value = "2014" },
                new SiteSetting { Key = "about.history.2.title", Value = "Arts Academy" },
                new SiteSetting { Key = "about.history.2.desc",  Value = "Music studios, drama theatre, and dance halls launched — the first dedicated performing arts complex in Kirinyaga County." },
                new SiteSetting { Key = "about.history.3.year",  Value = "2018" },
                new SiteSetting { Key = "about.history.3.title", Value = "IGCSE Pathway" },
                new SiteSetting { Key = "about.history.3.desc",  Value = "Cambridge international curriculum introduced, giving students a globally recognised academic pathway from Grade 10." },
                new SiteSetting { Key = "about.history.4.year",  Value = "2022" },
                new SiteSetting { Key = "about.history.4.title", Value = "Sports Complex" },
                new SiteSetting { Key = "about.history.4.desc",  Value = "New sports complex completed — football pitch, basketball courts, swimming pool, and athletics track." },
                new SiteSetting { Key = "about.history.5.year",  Value = "2026" },
                new SiteSetting { Key = "about.history.5.title", Value = "Digital Frontier" },
                new SiteSetting { Key = "about.history.5.desc",  Value = "360° virtual tours, smart classrooms, and digital learning platforms launched. 2,000+ students, 120+ staff." },
                // About — Core Values
                new SiteSetting { Key = "about.values.0.icon",  Value = "🎓" },
                new SiteSetting { Key = "about.values.0.title", Value = "Academic Excellence" },
                new SiteSetting { Key = "about.values.0.desc",  Value = "Rigorous standards across CBC and Cambridge IGCSE frameworks with continuous assessment." },
                new SiteSetting { Key = "about.values.1.icon",  Value = "🤝" },
                new SiteSetting { Key = "about.values.1.title", Value = "Integrity" },
                new SiteSetting { Key = "about.values.1.desc",  Value = "Honesty and ethical conduct are the foundation of every interaction in our community." },
                new SiteSetting { Key = "about.values.2.icon",  Value = "🌍" },
                new SiteSetting { Key = "about.values.2.title", Value = "Global Citizenship" },
                new SiteSetting { Key = "about.values.2.desc",  Value = "Celebrating Kenyan heritage while preparing learners for a connected, diverse world." },
                new SiteSetting { Key = "about.values.3.icon",  Value = "💡" },
                new SiteSetting { Key = "about.values.3.title", Value = "Innovation" },
                new SiteSetting { Key = "about.values.3.desc",  Value = "Encouraging curiosity, creativity, and problem-solving across all disciplines." },
                new SiteSetting { Key = "about.values.4.icon",  Value = "🏆" },
                new SiteSetting { Key = "about.values.4.title", Value = "Holistic Growth" },
                new SiteSetting { Key = "about.values.4.desc",  Value = "Developing the whole child — academically, physically, artistically, and emotionally." },
                new SiteSetting { Key = "about.values.5.icon",  Value = "🌱" },
                new SiteSetting { Key = "about.values.5.title", Value = "Sustainability" },
                new SiteSetting { Key = "about.values.5.desc",  Value = "Stewardship of our community and environment for future generations." },
                // About — Leadership
                new SiteSetting { Key = "about.leadership.0.name",  Value = "Dr. Wanjiku Mwangi" },
                new SiteSetting { Key = "about.leadership.0.title", Value = "Head Teacher" },
                new SiteSetting { Key = "about.leadership.0.img",   Value = "https://i.pravatar.cc/400?img=47" },
                new SiteSetting { Key = "about.leadership.0.bio",   Value = "PhD in Educational Leadership, University of Nairobi. 25 years in education. Champion of CBC implementation in Kirinyaga." },
                new SiteSetting { Key = "about.leadership.1.name",  Value = "Mr. Peter Kamau" },
                new SiteSetting { Key = "about.leadership.1.title", Value = "Deputy Head Teacher" },
                new SiteSetting { Key = "about.leadership.1.img",   Value = "https://i.pravatar.cc/400?img=11" },
                new SiteSetting { Key = "about.leadership.1.bio",   Value = "M.Ed Kenyatta University. Specialises in curriculum development and teacher professional growth." },
                new SiteSetting { Key = "about.leadership.2.name",  Value = "Ms. Eunice Achieng" },
                new SiteSetting { Key = "about.leadership.2.title", Value = "Director of Academics" },
                new SiteSetting { Key = "about.leadership.2.img",   Value = "https://i.pravatar.cc/400?img=48" },
                new SiteSetting { Key = "about.leadership.2.bio",   Value = "Cambridge-certified IGCSE coordinator. Oversees all academic pathways from PP1 through Grade 12." },
                new SiteSetting { Key = "about.leadership.3.name",  Value = "Mr. Francis Omondi" },
                new SiteSetting { Key = "about.leadership.3.title", Value = "Director of Co-Curricular" },
                new SiteSetting { Key = "about.leadership.3.img",   Value = "https://i.pravatar.cc/400?img=15" },
                new SiteSetting { Key = "about.leadership.3.bio",   Value = "Former national athlete. Leads sports, music, drama, and all co-curricular programmes across the school." },
                // Programs — framework bullet points
                new SiteSetting { Key = "programs.cbcFramework",   Value = "Competency-based assessment\nLearner-centered projects\nNational values integration\nCareer pathways from Grade 7\nContinuous assessment portfolios" },
                new SiteSetting { Key = "programs.igcseFramework", Value = "Cambridge international standards\nIGCSE & A-Level examinations\nGlobal university recognition\nRigorous external assessment\nCross-cultural curriculum breadth" }
            );
            await context.SaveChangesAsync();
        }

        // ── Program Levels ───────────────────────────────────────────────────────
        if (!await context.ProgramLevels.AnyAsync())
        {
            context.ProgramLevels.AddRange(
                new ProgramLevel { Slug = "daycare", Name = "Daycare & Early Years", Ages = "2–5 years",  Description = "Nurturing foundation with play-based learning and sensory exploration.",      ImageUrl = "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop", SortOrder = 1 },
                new ProgramLevel { Slug = "primary", Name = "Primary School",        Ages = "6–12 years", Description = "CBC-aligned excellence with literacy, numeracy, and creative foundations.",  ImageUrl = "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&h=600&fit=crop", SortOrder = 2 },
                new ProgramLevel { Slug = "junior",  Name = "Junior Secondary",      Ages = "13–15 years", Description = "Pre-IGCSE pathways with STEM labs and leadership development.",             ImageUrl = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop", SortOrder = 3 },
                new ProgramLevel { Slug = "senior",  Name = "Senior School",         Ages = "16–18 years", Description = "Cambridge IGCSE & A-Level preparation with university counseling.",        ImageUrl = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop", SortOrder = 4 }
            );
            await context.SaveChangesAsync();
        }

        // ── Public Fee Table ─────────────────────────────────────────────────────
        if (!await context.PublicFeeRows.AnyAsync())
        {
            context.PublicFeeRows.AddRange(
                new PublicFeeRow { Level = "Daycare",          Tuition = 85000,  Transport = 18000, Activities = 12000, SortOrder = 1 },
                new PublicFeeRow { Level = "Primary",          Tuition = 145000, Transport = 22000, Activities = 15000, SortOrder = 2 },
                new PublicFeeRow { Level = "Junior Secondary", Tuition = 185000, Transport = 25000, Activities = 18000, SortOrder = 3 },
                new PublicFeeRow { Level = "Senior / IGCSE",   Tuition = 245000, Transport = 28000, Activities = 22000, SortOrder = 4 }
            );
            await context.SaveChangesAsync();
        }

        // ── Events ───────────────────────────────────────────────────────────────
        if (!await context.Events.AnyAsync())
        {
            context.Events.AddRange(
                new Event { Title = "Opening Ceremony 2026",    StartDate = new DateTime(2026, 1,  12), EndDate = new DateTime(2026, 1,  12), Location = "Main Auditorium",          Description = "Welcome back celebration with performances.",            IsPublished = true, EventType = "Ceremony" },
                new Event { Title = "CBC Innovation Fair",       StartDate = new DateTime(2026, 2,  20), EndDate = new DateTime(2026, 2,  20), Location = "Science Block",             Description = "Student projects and STEM showcases.",                  IsPublished = true, EventType = "Academic" },
                new Event { Title = "Inter-House Athletics",     StartDate = new DateTime(2026, 3,  15), EndDate = new DateTime(2026, 3,  15), Location = "Sports Complex",            Description = "Annual track and field championships.",                 IsPublished = true, EventType = "Sports" },
                new Event { Title = "Music Gala Night",          StartDate = new DateTime(2026, 4,   8), EndDate = new DateTime(2026, 4,   8), Location = "Arts Academy",              Description = "Orchestra, choir, and solo performances.",             IsPublished = true, EventType = "Arts" },
                new Event { Title = "Parent-Teacher Conference", StartDate = new DateTime(2026, 4,  22), EndDate = new DateTime(2026, 4,  22), Location = "Various Classrooms",        Description = "Term 1 progress reviews.",                             IsPublished = true, EventType = "Meeting" },
                new Event { Title = "Drama & Dance Showcase",    StartDate = new DateTime(2026, 5,  10), EndDate = new DateTime(2026, 5,  10), Location = "Theatre Studio",            Description = "End-of-term performing arts premiere.",                IsPublished = true, EventType = "Arts" },
                new Event { Title = "IGCSE Mock Exams",          StartDate = new DateTime(2026, 5,  18), EndDate = new DateTime(2026, 5,  22), Location = "Exam Hall",                 Description = "Cambridge pathway assessment week.",                   IsPublished = true, EventType = "Academic" },
                new Event { Title = "Environmental Day",         StartDate = new DateTime(2026, 6,   5), EndDate = new DateTime(2026, 6,   5), Location = "School Grounds",            Description = "Tree planting and sustainability workshops.",           IsPublished = true, EventType = "Community" },
                new Event { Title = "Swimming Championships",    StartDate = new DateTime(2026, 6,  20), EndDate = new DateTime(2026, 6,  20), Location = "Aquatic Centre",            Description = "Inter-school swimming competition.",                   IsPublished = true, EventType = "Sports" },
                new Event { Title = "Career Day",                StartDate = new DateTime(2026, 7,   3), EndDate = new DateTime(2026, 7,   3), Location = "Conference Centre",         Description = "Industry leaders mentor senior students.",             IsPublished = true, EventType = "Academic" },
                new Event { Title = "Cultural Heritage Week",    StartDate = new DateTime(2026, 7,  15), EndDate = new DateTime(2026, 7,  19), Location = "Campus Wide",               Description = "Celebrating Kenyan heritage and diversity.",           IsPublished = true, EventType = "Community" },
                new Event { Title = "Science Olympiad",          StartDate = new DateTime(2026, 8,   1), EndDate = new DateTime(2026, 8,   1), Location = "Laboratories",              Description = "Regional science competition qualifiers.",             IsPublished = true, EventType = "Academic" },
                new Event { Title = "Founders Day",              StartDate = new DateTime(2026, 8,  20), EndDate = new DateTime(2026, 8,  20), Location = "Governor's Adjacent Plaza", Description = "Commemorating Alber School legacy.",                  IsPublished = true, EventType = "Ceremony" },
                new Event { Title = "Graduation Ceremony",       StartDate = new DateTime(2026, 11, 28), EndDate = new DateTime(2026, 11, 28), Location = "Grand Lawn",                Description = "Class of 2026 commencement.",                         IsPublished = true, EventType = "Ceremony" },
                new Event { Title = "Christmas Concert",         StartDate = new DateTime(2026, 12, 12), EndDate = new DateTime(2026, 12, 12), Location = "Main Auditorium",           Description = "Festive performances and charity drive.",             IsPublished = true, EventType = "Arts" }
            );
            await context.SaveChangesAsync();
        }

        // ── Blog Posts ───────────────────────────────────────────────────────────
        if (!await context.BlogPosts.AnyAsync())
        {
            context.BlogPosts.AddRange(
                new BlogPost
                {
                    Title = "Alber School Opens State-of-the-Art Music Academy",
                    Slug = "music-academy-opening",
                    Summary = "Our new piano studio and recording suite redefine arts education in Kirinyaga.",
                    Content = "Alber School proudly unveils its Music Academy adjacent to the Governor's Offices in Kutus. The facility features Steinway-ready piano rooms, acoustic-treated recording booths, and ensemble rehearsal spaces designed for CBC and IGCSE pathways alike.\n\nStudents will access world-class instruction from our 120+ faculty, including dedicated music specialists. Trial lessons are now open for prospective families.",
                    CoverImageUrl = "https://images.unsplash.com/photo-1511379938549-c1f69419868d?w=800&h=500&fit=crop",
                    IsPublished = true, PublishedAt = new DateTime(2026, 1, 15)
                },
                new BlogPost
                {
                    Title = "CBC vs IGCSE: Choosing the Right Pathway",
                    Slug = "cbc-vs-igcse-guide",
                    Summary = "A guide for parents navigating Kenya's dual curriculum excellence.",
                    Content = "At Alber School, we offer both Competency-Based Curriculum (CBC) and Cambridge IGCSE frameworks. Our academic leadership team helps families align pathway choice with student strengths, university goals, and learning style.\n\nSchedule a consultation through our admissions portal to explore personalized recommendations.",
                    CoverImageUrl = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=500&fit=crop",
                    IsPublished = true, PublishedAt = new DateTime(2026, 2, 2)
                },
                new BlogPost
                {
                    Title = "Champions on the Field: Term 1 Sports Recap",
                    Slug = "term1-sports-recap",
                    Summary = "Our athletes dominate regional fixtures across football, rugby, and swimming.",
                    Content = "From the premium sports complex to inter-school championships, Alber athletes continue to set records. Player of the Month honors go to Form 3 striker Brian Mutua for exceptional leadership.\n\nUpcoming fixtures are live on our Sports page with real-time status badges.",
                    CoverImageUrl = "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=500&fit=crop",
                    IsPublished = true, PublishedAt = new DateTime(2026, 2, 28)
                },
                new BlogPost
                {
                    Title = "Sustainable Campus Initiative Launches",
                    Slug = "sustainable-campus-initiative",
                    Summary = "Solar panels and green roofs power our commitment to environmental stewardship.",
                    Content = "Alber School invests in renewable energy and student-led sustainability clubs. Environmental Day features tree planting across our 15-acre campus with views toward Kirinyaga's rolling hills.",
                    CoverImageUrl = "https://images.unsplash.com/photo-1541339907198-e08756dedfbf?w=800&h=500&fit=crop",
                    IsPublished = true, PublishedAt = new DateTime(2026, 3, 10)
                },
                new BlogPost
                {
                    Title = "Parent Portal: M-Pesa Fee Payments Now Live",
                    Slug = "mpesa-fee-payments-live",
                    Summary = "Pay school fees securely via Paybill 522522 — Account: ALBER + Student ID.",
                    Content = "Our parent dashboard integrates mock M-Pesa Paybill flows for demonstration. Real deployments would connect to Safaricom Daraja API. Track invoices, attendance heatmaps, and grade progress in one premium interface.",
                    CoverImageUrl = "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&h=500&fit=crop",
                    IsPublished = true, PublishedAt = new DateTime(2026, 3, 20)
                },
                new BlogPost
                {
                    Title = "Drama & Dance: Behind the Showcase",
                    Slug = "drama-dance-showcase",
                    Summary = "Mirror-walled studios and professional lighting elevate performing arts.",
                    Content = "Our Drama & Dance Academy features sprung floors, full-wall mirrors, and 4K capture for portfolio development. Book a trial lesson through the arts pages.",
                    CoverImageUrl = "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=500&fit=crop",
                    IsPublished = true, PublishedAt = new DateTime(2026, 4, 1)
                }
            );
            await context.SaveChangesAsync();
        }

        // ── Gallery Images ───────────────────────────────────────────────────────
        if (!await context.GalleryImages.AnyAsync())
        {
            var gallerySeeds = new[] {
                "alber-campus1","alber-class1","alber-sports1","alber-arts1","alber-events1","alber-students1",
                "alber-campus2","alber-class2","alber-sports2","alber-arts2","alber-events2","alber-students2"
            };
            var galleryCategories = new[] { "Campus","Classrooms","Sports","Arts","Events","Students" };
            var galleryImages = Enumerable.Range(0, 40).Select(i => new GalleryImage
            {
                Url       = $"https://picsum.photos/seed/{gallerySeeds[i % gallerySeeds.Length]}-{i}/800/600",
                Category  = galleryCategories[i % galleryCategories.Length],
                Caption   = $"Alber School {galleryCategories[i % galleryCategories.Length]} {i + 1}",
                SortOrder = i + 1,
                IsPublic  = true
            }).ToList();
            context.GalleryImages.AddRange(galleryImages);
            await context.SaveChangesAsync();
        }

        if (await userManager.Users.AnyAsync()) return;

        logger.LogInfo("Seeding database with demo data...");

        var adminUser = new ApplicationUser
        {
            FirstName = "Wanjiku", LastName = "Mwangi",
            Email = "admin@alberschool.ke", UserName = "admin@alberschool.ke",
            EmailConfirmed = true
        };
        var adminResult = await userManager.CreateAsync(adminUser, "Admin@12345678");
        if (adminResult.Succeeded) await userManager.AddToRoleAsync(adminUser, "Admin");

        var class10A = new Class { Name = "Grade 10", Section = "A", Description = "Grade 10 Section A" };
        var class9B = new Class { Name = "Grade 9", Section = "B", Description = "Grade 9 Section B" };
        context.Classes.AddRange(class10A, class9B);
        await context.SaveChangesAsync();

        var subjects = new[]
        {
            new Subject { Name = "Mathematics",        Code = "MATH", ClassId = class10A.Id },
            new Subject { Name = "English",            Code = "ENG",  ClassId = class10A.Id },
            new Subject { Name = "Science",            Code = "SCI",  ClassId = class10A.Id },
            new Subject { Name = "History",            Code = "HIST", ClassId = class10A.Id },
            new Subject { Name = "Physical Education", Code = "PE",   ClassId = class10A.Id },
        };
        context.Subjects.AddRange(subjects);
        await context.SaveChangesAsync();

        var teacherUser = new ApplicationUser
        {
            FirstName = "James", LastName = "Ochieng",
            Email = "teacher@alberschool.ke", UserName = "teacher@alberschool.ke",
            EmailConfirmed = true
        };
        var teacherResult = await userManager.CreateAsync(teacherUser, "Teacher@12345678");
        if (teacherResult.Succeeded) await userManager.AddToRoleAsync(teacherUser, "Teacher");
        var teacher = new Teacher
        {
            UserId = teacherUser.Id, Qualification = "B.Ed. Mathematics",
            Specialization = "Mathematics", HireDate = new DateTime(2020, 1, 15, 0, 0, 0, DateTimeKind.Utc)
        };
        context.Teachers.Add(teacher);
        await context.SaveChangesAsync();

        var parentUser = new ApplicationUser
        {
            FirstName = "Grace", LastName = "Njeri",
            Email = "parent@alberschool.ke", UserName = "parent@alberschool.ke",
            EmailConfirmed = true
        };
        var parentResult = await userManager.CreateAsync(parentUser, "Parent@12345678");
        if (parentResult.Succeeded) await userManager.AddToRoleAsync(parentUser, "Parent");
        var parent = new Parent { UserId = parentUser.Id, Occupation = "Nurse", Address = "Nairobi, Kenya" };
        context.Parents.Add(parent);
        await context.SaveChangesAsync();

        var studentUser = new ApplicationUser
        {
            FirstName = "Amani", LastName = "Kariuki",
            Email = "student@alberschool.ke", UserName = "student@alberschool.ke",
            EmailConfirmed = true
        };
        var studentResult = await userManager.CreateAsync(studentUser, "Student@12345678");
        if (studentResult.Succeeded) await userManager.AddToRoleAsync(studentUser, "Student");
        var student = new Student
        {
            UserId = studentUser.Id, ClassId = class10A.Id, ParentId = parent.Id,
            DateOfBirth = new DateTime(2008, 3, 15, 0, 0, 0, DateTimeKind.Utc),
            Gender = "Male", Address = "Nairobi, Kenya"
        };
        context.Students.Add(student);
        await context.SaveChangesAsync();

        var timetableEntries = new[]
        {
            new TimetableEntry { ClassId=class10A.Id, SubjectId=subjects[0].Id, TeacherId=teacher.Id, DayOfWeek=DayOfWeek.Monday,    StartTime=new TimeSpan(8,0,0),  EndTime=new TimeSpan(9,0,0)  },
            new TimetableEntry { ClassId=class10A.Id, SubjectId=subjects[1].Id, TeacherId=teacher.Id, DayOfWeek=DayOfWeek.Monday,    StartTime=new TimeSpan(9,0,0),  EndTime=new TimeSpan(10,0,0) },
            new TimetableEntry { ClassId=class10A.Id, SubjectId=subjects[2].Id, TeacherId=teacher.Id, DayOfWeek=DayOfWeek.Monday,    StartTime=new TimeSpan(11,0,0), EndTime=new TimeSpan(12,0,0) },
            new TimetableEntry { ClassId=class10A.Id, SubjectId=subjects[0].Id, TeacherId=teacher.Id, DayOfWeek=DayOfWeek.Tuesday,   StartTime=new TimeSpan(8,0,0),  EndTime=new TimeSpan(9,0,0)  },
            new TimetableEntry { ClassId=class10A.Id, SubjectId=subjects[3].Id, TeacherId=teacher.Id, DayOfWeek=DayOfWeek.Tuesday,   StartTime=new TimeSpan(10,0,0), EndTime=new TimeSpan(11,0,0) },
            new TimetableEntry { ClassId=class10A.Id, SubjectId=subjects[4].Id, TeacherId=teacher.Id, DayOfWeek=DayOfWeek.Wednesday,  StartTime=new TimeSpan(8,0,0),  EndTime=new TimeSpan(9,0,0)  },
            new TimetableEntry { ClassId=class10A.Id, SubjectId=subjects[1].Id, TeacherId=teacher.Id, DayOfWeek=DayOfWeek.Wednesday,  StartTime=new TimeSpan(10,0,0), EndTime=new TimeSpan(11,0,0) },
            new TimetableEntry { ClassId=class10A.Id, SubjectId=subjects[2].Id, TeacherId=teacher.Id, DayOfWeek=DayOfWeek.Thursday,  StartTime=new TimeSpan(8,0,0),  EndTime=new TimeSpan(9,0,0)  },
            new TimetableEntry { ClassId=class10A.Id, SubjectId=subjects[0].Id, TeacherId=teacher.Id, DayOfWeek=DayOfWeek.Thursday,  StartTime=new TimeSpan(9,0,0),  EndTime=new TimeSpan(10,0,0) },
            new TimetableEntry { ClassId=class10A.Id, SubjectId=subjects[3].Id, TeacherId=teacher.Id, DayOfWeek=DayOfWeek.Friday,    StartTime=new TimeSpan(8,0,0),  EndTime=new TimeSpan(9,0,0)  },
            new TimetableEntry { ClassId=class10A.Id, SubjectId=subjects[4].Id, TeacherId=teacher.Id, DayOfWeek=DayOfWeek.Friday,    StartTime=new TimeSpan(10,0,0), EndTime=new TimeSpan(11,0,0) },
        };
        context.TimetableEntries.AddRange(timetableEntries);

        var now = DateTime.UtcNow;
        var assignments = new[]
        {
            new Assignment { Title="Algebra Practice Set", Description="Complete exercises 4.1 to 4.5", DueDate=now.AddDays(7),  ClassId=class10A.Id, SubjectId=subjects[0].Id, TeacherId=teacher.Id },
            new Assignment { Title="Essay: The Environment", Description="Write a 500-word essay on climate change", DueDate=now.AddDays(10), ClassId=class10A.Id, SubjectId=subjects[1].Id, TeacherId=teacher.Id },
            new Assignment { Title="Lab Report", Description="Submit the water chemistry lab report", DueDate=now.AddDays(5),  ClassId=class10A.Id, SubjectId=subjects[2].Id, TeacherId=teacher.Id },
            new Assignment { Title="Kenya History Timeline", Description="Create a timeline of post-independence Kenya", DueDate=now.AddDays(14), ClassId=class10A.Id, SubjectId=subjects[3].Id, TeacherId=teacher.Id },
        };
        context.Assignments.AddRange(assignments);

        var grades = new[]
        {
            new Grade { StudentId=student.Id, SubjectId=subjects[0].Id, Score=82, MaxScore=100, AssessmentType="Midterm",  AssessmentDate=now.AddMonths(-2), Remarks="Good work" },
            new Grade { StudentId=student.Id, SubjectId=subjects[1].Id, Score=76, MaxScore=100, AssessmentType="Midterm",  AssessmentDate=now.AddMonths(-2), Remarks="Needs improvement in grammar" },
            new Grade { StudentId=student.Id, SubjectId=subjects[2].Id, Score=91, MaxScore=100, AssessmentType="Midterm",  AssessmentDate=now.AddMonths(-2), Remarks="Excellent" },
            new Grade { StudentId=student.Id, SubjectId=subjects[3].Id, Score=68, MaxScore=100, AssessmentType="Midterm",  AssessmentDate=now.AddMonths(-2), Remarks="Review chapters 3-5" },
            new Grade { StudentId=student.Id, SubjectId=subjects[4].Id, Score=95, MaxScore=100, AssessmentType="Midterm",  AssessmentDate=now.AddMonths(-2), Remarks="Outstanding" },
            new Grade { StudentId=student.Id, SubjectId=subjects[0].Id, Score=78, MaxScore=100, AssessmentType="CAT 1",    AssessmentDate=now.AddMonths(-4), Remarks="Good effort" },
            new Grade { StudentId=student.Id, SubjectId=subjects[1].Id, Score=83, MaxScore=100, AssessmentType="CAT 1",    AssessmentDate=now.AddMonths(-4), Remarks="Well done" },
            new Grade { StudentId=student.Id, SubjectId=subjects[2].Id, Score=88, MaxScore=100, AssessmentType="CAT 1",    AssessmentDate=now.AddMonths(-4), Remarks="Excellent" },
        };
        context.Grades.AddRange(grades);

        var attendanceDates = Enumerable.Range(1, 30)
            .Select(i => now.AddDays(-i))
            .Where(d => d.DayOfWeek != DayOfWeek.Saturday && d.DayOfWeek != DayOfWeek.Sunday)
            .ToList();

        var rnd = new Random(42);
        var attendanceRecords = attendanceDates.Select(d => new AttendanceRecord
        {
            StudentId = student.Id,
            Date = d.Date,
            Status = rnd.Next(0, 10) switch
            {
                0 => Entities.Models.Attendance.AttendanceStatus.Absent,
                1 => Entities.Models.Attendance.AttendanceStatus.Late,
                _ => Entities.Models.Attendance.AttendanceStatus.Present,
            },
            Remarks = null,
            RecordedById = teacherUser.Id,
        }).ToList();
        context.AttendanceRecords.AddRange(attendanceRecords);

        var feeStructure = new FeeStructure
        {
            Name = "Term 2 School Fees",
            Amount = 25000,
            Term = "Term 2",
            AcademicYear = "2026",
            ClassId = class10A.Id,
            FeeType = "Tuition",
            DueDate = now.AddMonths(1),
        };
        context.FeeStructures.Add(feeStructure);
        await context.SaveChangesAsync();

        var studentFee = new StudentFee
        {
            StudentId = student.Id,
            FeeStructureId = feeStructure.Id,
            AmountDue = 25000,
            AmountPaid = 10000,
            Status = PaymentStatus.Partial,
        };
        context.StudentFees.Add(studentFee);
        await context.SaveChangesAsync();

        logger.LogInfo("Demo seed complete. Logins: admin@alberschool.ke / Admin@12345678  teacher@alberschool.ke / Teacher@12345678  student@alberschool.ke / Student@12345678  parent@alberschool.ke / Parent@12345678");
    }
    catch (Exception ex)
    {
        logger.LogError($"Seed failed: {ex.Message}");
    }
}
