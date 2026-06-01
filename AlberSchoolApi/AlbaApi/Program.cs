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

        // Seed site content tables independently (run even when users already exist)
        if (!await context.SiteSettings.AnyAsync())
        {
            context.SiteSettings.AddRange(
                new SiteSetting { Key = "home.hero.tagline",           Value = "Where Excellence" },
                new SiteSetting { Key = "home.hero.taglineGold",       Value = "Meets Tomorrow" },
                new SiteSetting { Key = "home.hero.subtitle",          Value = "Premium private education in the heart of Kirinyaga. 2,000+ learners, 120+ expert educators — academics, sports, music, and performing arts under one roof." },
                new SiteSetting { Key = "home.hero.directorName",      Value = "Mr. Albert Njeru" },
                new SiteSetting { Key = "home.hero.directorTitle",     Value = "Founder & Director" },
                new SiteSetting { Key = "home.hero.directorCredential",Value = "M.Ed., UoN" },
                new SiteSetting { Key = "home.hero.directorQuote",     Value = "Every child in Kirinyaga deserves an education that changes the trajectory of a family for generations. That is the promise we keep, every single day." },
                new SiteSetting { Key = "home.stats.0.label",          Value = "Students" },
                new SiteSetting { Key = "home.stats.0.value",          Value = "2,000+" },
                new SiteSetting { Key = "home.stats.1.label",          Value = "Educators" },
                new SiteSetting { Key = "home.stats.1.value",          Value = "120+" },
                new SiteSetting { Key = "home.stats.2.label",          Value = "School Buses" },
                new SiteSetting { Key = "home.stats.2.value",          Value = "8" },
                new SiteSetting { Key = "home.stats.3.label",          Value = "Sports Codes" },
                new SiteSetting { Key = "home.stats.3.value",          Value = "12" },
                new SiteSetting { Key = "about.mission",  Value = "To provide world-class holistic education that develops academically excellent, morally upright, and socially responsible citizens who will transform Kenya and the world." },
                new SiteSetting { Key = "about.vision",   Value = "To be the leading center of educational excellence in East Africa, recognised for outstanding academic outcomes, character formation, and innovation." },
                new SiteSetting { Key = "about.history",  Value = "Alber School was founded in Kutus, Kirinyaga County, adjacent to the Governor's Offices. Starting with a handful of students, the school has grown to over 2,000 learners and 120 expert educators, offering both the CBC national framework and Cambridge IGCSE & A-Level pathways." },
                new SiteSetting { Key = "about.values",   Value = "Excellence · Integrity · Innovation · Compassion · Patriotism" },
                new SiteSetting { Key = "programs.cbcFramework",   Value = "Competency-based assessment\nLearner-centered projects\nNational values integration\nCareer pathways from Grade 7\nContinuous assessment portfolios" },
                new SiteSetting { Key = "programs.igcseFramework", Value = "Cambridge international standards\nIGCSE & A-Level examinations\nGlobal university recognition\nRigorous external assessment\nCross-cultural curriculum breadth" }
            );
            await context.SaveChangesAsync();
        }

        if (!await context.ProgramLevels.AnyAsync())
        {
            context.ProgramLevels.AddRange(
                new ProgramLevel { Slug = "daycare", Name = "Daycare & Early Years", Ages = "2–5 years", Description = "Nurturing foundation with play-based learning and sensory exploration.", ImageUrl = "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop", SortOrder = 1 },
                new ProgramLevel { Slug = "primary", Name = "Primary School",         Ages = "6–12 years", Description = "CBC-aligned excellence with literacy, numeracy, and creative foundations.",     ImageUrl = "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&h=600&fit=crop", SortOrder = 2 },
                new ProgramLevel { Slug = "junior",  Name = "Junior Secondary",       Ages = "13–15 years", Description = "Pre-IGCSE pathways with STEM labs and leadership development.",                ImageUrl = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop", SortOrder = 3 },
                new ProgramLevel { Slug = "senior",  Name = "Senior School",          Ages = "16–18 years", Description = "Cambridge IGCSE & A-Level preparation with university counseling.",             ImageUrl = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop", SortOrder = 4 }
            );
            await context.SaveChangesAsync();
        }

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
