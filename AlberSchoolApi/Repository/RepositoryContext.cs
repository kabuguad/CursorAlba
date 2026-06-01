using Entities.Models.Academics;
using Entities.Models.Admissions;
using Entities.Models.Attendance;
using Entities.Models.Content;
using Entities.Models.Finance;
using Entities.Models.Grade;
using Entities.Models.User;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
namespace Repository;

public class RepositoryContext(DbContextOptions options) : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>(options)
{

    public DbSet<Student> Students { get; set; }
    public DbSet<Teacher> Teachers { get; set; }
    public DbSet<Parent> Parents { get; set; }

    public DbSet<Class> Classes { get; set; }
    public DbSet<Subject> Subjects { get; set; }
    public DbSet<TimetableEntry> TimetableEntries { get; set; }
    public DbSet<Assignment> Assignments { get; set; }

    public DbSet<Grade> Grades { get; set; }
    public DbSet<AttendanceRecord> AttendanceRecords { get; set; }

    public DbSet<FeeStructure> FeeStructures { get; set; }
    public DbSet<StudentFee> StudentFees { get; set; }
    public DbSet<Payment> Payments { get; set; }

    public DbSet<Application> Applications { get; set; }
    public DbSet<Inquiry> Inquiries { get; set; }

    public DbSet<BlogPost> BlogPosts { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<GalleryImage> GalleryImages { get; set; }

    public DbSet<SiteSetting> SiteSettings { get; set; }
    public DbSet<ProgramLevel> ProgramLevels { get; set; }
    public DbSet<PublicFeeRow> PublicFeeRows { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
            v => v.ToUniversalTime(),
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        foreach (var entityType in modelBuilder.Model.GetEntityTypes()
                     .Where(t => t.ClrType == typeof(DateTime) || t.ClrType == typeof(DateTime?)))
        {
            modelBuilder.Entity(entityType.Name)
                .Property(entityType.Name).HasConversion(dateTimeConverter);
        }

        modelBuilder.Entity<Student>()
            .HasIndex(s => s.UserId)
            .IsUnique();

        modelBuilder.Entity<Teacher>()
            .HasIndex(t => t.UserId)
            .IsUnique();

        modelBuilder.Entity<Parent>()
            .HasIndex(p => p.UserId)
            .IsUnique();

        modelBuilder.Entity<Subject>()
            .HasIndex(s => s.ClassId);

        modelBuilder.Entity<Assignment>()
            .HasOne(a => a.Subject)
            .WithMany()
            .HasForeignKey(a => a.SubjectId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Assignment>()
            .HasOne(a => a.Teacher)
            .WithMany()
            .HasForeignKey(a => a.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TimetableEntry>()
            .HasOne(t => t.Class)
            .WithMany()
            .HasForeignKey(t => t.ClassId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TimetableEntry>()
            .HasOne(t => t.Subject)
            .WithMany(s => s.TimetableEntries)
            .HasForeignKey(t => t.SubjectId)
            .OnDelete(DeleteBehavior.Cascade);

modelBuilder.Entity<TimetableEntry>()
            .HasOne(t => t.Teacher)
            .WithMany()
            .HasForeignKey(t => t.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Grade>()
            .HasOne(g => g.Subject)
            .WithMany()
            .HasForeignKey(g => g.SubjectId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Grade>()
            .HasIndex(g => new { g.StudentId, g.SubjectId, g.AssessmentDate, g.AssessmentType })
            .IsUnique();

        modelBuilder.Entity<AttendanceRecord>()
            .HasIndex(a => new { a.StudentId, a.Date })
            .IsUnique();

        modelBuilder.Entity<BlogPost>()
            .HasIndex(b => b.Slug)
            .IsUnique();

        modelBuilder.Entity<FeeStructure>()
            .Property(f => f.Amount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<StudentFee>()
            .Property(f => f.AmountDue)
            .HasPrecision(18, 2);

        modelBuilder.Entity<StudentFee>()
            .Property(f => f.AmountPaid)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Payment>()
            .Property(p => p.Amount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<PublicFeeRow>()
            .Property(f => f.Tuition)
            .HasPrecision(18, 2);

        modelBuilder.Entity<PublicFeeRow>()
            .Property(f => f.Transport)
            .HasPrecision(18, 2);

        modelBuilder.Entity<PublicFeeRow>()
            .Property(f => f.Activities)
            .HasPrecision(18, 2);

        modelBuilder.Entity<SiteSetting>()
            .HasIndex(s => s.Key)
            .IsUnique();
    }
}
