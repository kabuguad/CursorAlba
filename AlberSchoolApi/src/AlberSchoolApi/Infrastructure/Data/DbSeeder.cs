using AlberSchoolApi.Domain.Entities.Identity;
using AlberSchoolApi.Domain.Entities.System;
using AlberSchoolApi.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace AlberSchoolApi.Infrastructure.Data;

/// <summary>
/// Seeds essential reference data on first run.
/// Called via <c>dotnet run -- --seed</c> or automatically in development when the DB is empty.
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db, ILogger logger)
    {
        await db.Database.EnsureCreatedAsync();

        await SeedPermissionsAsync(db, logger);
        await SeedSystemSettingsAsync(db, logger);
        await SeedAdminUserAsync(db, logger);
        await SeedContentPagesAsync(db, logger);

        logger.LogInformation("Database seeding complete.");
    }

    // ── Permissions ───────────────────────────────────────────────────────

    private static readonly (string Code, string Group, string Desc)[] PermissionDefs =
    [
        // Users
        ("manage_users",          "Users",      "Create, update, deactivate and delete user accounts"),
        ("view_users",            "Users",      "View the user list and profiles"),

        // Students
        ("manage_students",       "Students",   "Create, update and delete student records"),
        ("view_students",         "Students",   "View student list and profiles"),

        // Staff
        ("manage_staff",          "Staff",      "Create, update and delete staff records"),
        ("view_staff",            "Staff",      "View staff list and profiles"),

        // Academic
        ("manage_academic",       "Academic",   "Manage years, terms, classes, subjects, timetable"),
        ("enter_results",         "Academic",   "Record / edit exam results"),
        ("record_attendance",     "Academic",   "Record daily attendance"),
        ("view_reports",          "Academic",   "View academic reports and analytics"),

        // Finance
        ("manage_finance",        "Finance",    "Manage invoices, payments, fee structures, expenses"),
        ("view_finance",          "Finance",    "View financial records and summaries"),

        // Announcements
        ("manage_announcements",  "Comms",      "Create, publish, and delete announcements"),

        // Admissions
        ("manage_admissions",     "Admissions", "Review, approve or reject admission applications"),
        ("view_admissions",       "Admissions", "View admission applications"),

        // Library
        ("manage_library",        "Library",    "Add books and manage borrowings"),

        // CMS
        ("manage_cms",            "CMS",        "Edit website content, blog posts, gallery, events"),

        // System
        ("manage_settings",       "System",     "Update school settings, SMTP, and social links"),
        ("view_audit_logs",       "System",     "View system audit trail"),
        ("manage_transport",      "Transport",  "Manage vehicles and transport routes"),
    ];

    private static async Task SeedPermissionsAsync(AppDbContext db, ILogger logger)
    {
        var existing = await db.Permissions.Select(p => p.Code).ToHashSetAsync();
        var toAdd = PermissionDefs
            .Where(p => !existing.Contains(p.Code))
            .Select(p => new Permission { Code = p.Code, PermissionGroup = p.Group, Description = p.Desc });

        if (toAdd.Any())
        {
            await db.Permissions.AddRangeAsync(toAdd);
            await db.SaveChangesAsync();
            logger.LogInformation("Seeded {Count} permissions.", toAdd.Count());
        }
    }

    // ── System Settings ───────────────────────────────────────────────────

    private static async Task SeedSystemSettingsAsync(AppDbContext db, ILogger logger)
    {
        if (await db.SystemSettings.AnyAsync()) return;

        await db.SystemSettings.AddAsync(new SystemSettings
        {
            Id = 1,
            SchoolName = "Alber School",
            SchoolMotto = "Excellence in Education",
            Founded = 2000,
            County = "Kirinyaga",
            Town = "Kutus",
            Email = "info@alberschool.ke",
            AdmissionsEmail = "admissions@alberschool.ke",
            Phone = "+254 700 000 000",
            PrimaryColor = "#1a3c5e"
        });
        await db.SaveChangesAsync();
        logger.LogInformation("Seeded SystemSettings.");
    }

    // ── Admin User ────────────────────────────────────────────────────────

    private static async Task SeedAdminUserAsync(AppDbContext db, ILogger logger)
    {
        const string adminEmail = "admin@alberschool.ke";
        if (await db.Users.IgnoreQueryFilters().AnyAsync(u => u.Email == adminEmail)) return;

        var allPermissions = await db.Permissions.ToListAsync();
        var admin = new User
        {
            Name = "System Administrator",
            Email = adminEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@1234!"),
            Role = UserRole.Admin,
            Status = UserStatus.Active,
            EmailVerifiedAt = DateTime.UtcNow
        };
        foreach (var perm in allPermissions)
            admin.UserPermissions.Add(new UserPermission { Permission = perm, GrantedAt = DateTime.UtcNow });

        await db.Users.AddAsync(admin);
        await db.SaveChangesAsync();
        logger.LogInformation("Seeded default admin user: {Email}", adminEmail);
    }

    // ── CMS Pages ─────────────────────────────────────────────────────────

    private static readonly string[] PageSlugs =
        ["home", "about", "academics", "admissions", "facilities", "contact"];

    private static async Task SeedContentPagesAsync(AppDbContext db, ILogger logger)
    {
        var existing = await db.ContentPages.Select(p => p.Slug).ToHashSetAsync();
        var toAdd = PageSlugs.Where(s => !existing.Contains(s))
            .Select(s => new Domain.Entities.CMS.ContentPage
            {
                Slug = s,
                Title = char.ToUpper(s[0]) + s[1..],
                IsPublished = true,
                PublishedAt = DateTime.UtcNow
            });

        if (toAdd.Any())
        {
            await db.ContentPages.AddRangeAsync(toAdd);
            await db.SaveChangesAsync();
            logger.LogInformation("Seeded {Count} content pages.", toAdd.Count());
        }
    }
}
