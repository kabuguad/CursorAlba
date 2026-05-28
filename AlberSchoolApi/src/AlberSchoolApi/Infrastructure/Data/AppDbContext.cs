using AlberSchoolApi.Domain.Entities.Academic;
using AlberSchoolApi.Domain.Entities.Admissions;
using AlberSchoolApi.Domain.Entities.CMS;
using AlberSchoolApi.Domain.Entities.Communications;
using AlberSchoolApi.Domain.Entities.Finance;
using AlberSchoolApi.Domain.Entities.Identity;
using AlberSchoolApi.Domain.Entities.Library;
using AlberSchoolApi.Domain.Entities.People;
using AlberSchoolApi.Domain.Entities.System;
using AlberSchoolApi.Domain.Entities.Transport;
using Microsoft.EntityFrameworkCore;

namespace AlberSchoolApi.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // ── Identity ─────────────────────────────────────────────────────────
    public DbSet<User> Users => Set<User>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<UserPermission> UserPermissions => Set<UserPermission>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    // ── People ────────────────────────────────────────────────────────────
    public DbSet<Student> Students => Set<Student>();
    public DbSet<StudentEmergencyContact> StudentEmergencyContacts => Set<StudentEmergencyContact>();
    public DbSet<StudentParent> StudentParents => Set<StudentParent>();
    public DbSet<StaffMember> StaffMembers => Set<StaffMember>();
    public DbSet<StaffSubject> StaffSubjects => Set<StaffSubject>();

    // ── Academic ──────────────────────────────────────────────────────────
    public DbSet<AcademicYear> AcademicYears => Set<AcademicYear>();
    public DbSet<Term> Terms => Set<Term>();
    public DbSet<SchoolClass> SchoolClasses => Set<SchoolClass>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<ClassSubject> ClassSubjects => Set<ClassSubject>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
    public DbSet<AssessmentScheme> AssessmentSchemes => Set<AssessmentScheme>();
    public DbSet<AssessmentBand> AssessmentBands => Set<AssessmentBand>();
    public DbSet<Exam> Exams => Set<Exam>();
    public DbSet<ExamGrade> ExamGrades => Set<ExamGrade>();
    public DbSet<StudentResult> StudentResults => Set<StudentResult>();
    public DbSet<TimetableSlot> TimetableSlots => Set<TimetableSlot>();
    public DbSet<Homework> Homeworks => Set<Homework>();
    public DbSet<AttendanceRecord> AttendanceRecords => Set<AttendanceRecord>();
    public DbSet<LeaveRequest> LeaveRequests => Set<LeaveRequest>();
    public DbSet<MeetingSlot> MeetingSlots => Set<MeetingSlot>();

    // ── Finance ───────────────────────────────────────────────────────────
    public DbSet<FeeStructure> FeeStructures => Set<FeeStructure>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<InvoiceLineItem> InvoiceLineItems => Set<InvoiceLineItem>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Scholarship> Scholarships => Set<Scholarship>();
    public DbSet<ExpenseCategory> ExpenseCategories => Set<ExpenseCategory>();
    public DbSet<Expense> Expenses => Set<Expense>();

    // ── Communications ────────────────────────────────────────────────────
    public DbSet<Announcement> Announcements => Set<Announcement>();
    public DbSet<AnnouncementTargetRole> AnnouncementTargetRoles => Set<AnnouncementTargetRole>();
    public DbSet<AnnouncementTargetGrade> AnnouncementTargetGrades => Set<AnnouncementTargetGrade>();
    public DbSet<AnnouncementRead> AnnouncementReads => Set<AnnouncementRead>();
    public DbSet<Message> Messages => Set<Message>();

    // ── Transport ─────────────────────────────────────────────────────────
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<TransportRoute> TransportRoutes => Set<TransportRoute>();
    public DbSet<TransportStop> TransportStops => Set<TransportStop>();

    // ── Library ───────────────────────────────────────────────────────────
    public DbSet<Book> Books => Set<Book>();
    public DbSet<Borrowing> Borrowings => Set<Borrowing>();

    // ── Admissions ────────────────────────────────────────────────────────
    public DbSet<AdmissionApplication> AdmissionApplications => Set<AdmissionApplication>();
    public DbSet<AdmissionDocument> AdmissionDocuments => Set<AdmissionDocument>();

    // ── CMS ───────────────────────────────────────────────────────────────
    public DbSet<ContentPage> ContentPages => Set<ContentPage>();
    public DbSet<ContentSection> ContentSections => Set<ContentSection>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<GalleryAlbum> GalleryAlbums => Set<GalleryAlbum>();
    public DbSet<GalleryImage> GalleryImages => Set<GalleryImage>();
    public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<VirtualTourSpot> VirtualTourSpots => Set<VirtualTourSpot>();

    // ── System ────────────────────────────────────────────────────────────
    public DbSet<SystemSettings> SystemSettings => Set<SystemSettings>();
    public DbSet<SocialLink> SocialLinks => Set<SocialLink>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all entity type configurations from this assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // Global query filter — soft-delete filtering
        modelBuilder.Entity<User>().HasQueryFilter(u => !u.IsDeleted);
        modelBuilder.Entity<Student>().HasQueryFilter(s => !s.IsDeleted);
        modelBuilder.Entity<StaffMember>().HasQueryFilter(sm => !sm.IsDeleted);
    }
}
