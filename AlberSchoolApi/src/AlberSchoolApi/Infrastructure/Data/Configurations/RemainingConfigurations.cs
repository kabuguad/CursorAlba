using AlberSchoolApi.Domain.Entities.Admissions;
using AlberSchoolApi.Domain.Entities.CMS;
using AlberSchoolApi.Domain.Entities.Communications;
using AlberSchoolApi.Domain.Entities.Library;
using AlberSchoolApi.Domain.Entities.System;
using AlberSchoolApi.Domain.Entities.Transport;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AlberSchoolApi.Infrastructure.Data.Configurations;

// ── Communications ────────────────────────────────────────────────────────

public class AnnouncementConfiguration : IEntityTypeConfiguration<Announcement>
{
    public void Configure(EntityTypeBuilder<Announcement> b)
    {
        b.ToTable("Announcements");
        b.HasKey(a => a.Id);
        b.Property(a => a.Title).HasMaxLength(500).IsRequired();
        b.Property(a => a.Priority).HasConversion<string>().HasMaxLength(20);
        b.Property(a => a.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(a => a.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        b.HasOne(a => a.Author).WithMany().HasForeignKey(a => a.CreatedBy).OnDelete(DeleteBehavior.Restrict);
    }
}

public class AnnouncementTargetRoleConfiguration : IEntityTypeConfiguration<AnnouncementTargetRole>
{
    public void Configure(EntityTypeBuilder<AnnouncementTargetRole> b)
    {
        b.ToTable("AnnouncementTargetRoles");
        b.HasKey(tr => new { tr.AnnouncementId, tr.Role });
        b.Property(tr => tr.Role).HasMaxLength(20);
        b.HasOne(tr => tr.Announcement).WithMany(a => a.TargetRoles).HasForeignKey(tr => tr.AnnouncementId).OnDelete(DeleteBehavior.Cascade);
    }
}

public class AnnouncementTargetGradeConfiguration : IEntityTypeConfiguration<AnnouncementTargetGrade>
{
    public void Configure(EntityTypeBuilder<AnnouncementTargetGrade> b)
    {
        b.ToTable("AnnouncementTargetGrades");
        b.HasKey(tg => new { tg.AnnouncementId, tg.Grade });
        b.Property(tg => tg.Grade).HasMaxLength(50);
        b.HasOne(tg => tg.Announcement).WithMany(a => a.TargetGrades).HasForeignKey(tg => tg.AnnouncementId).OnDelete(DeleteBehavior.Cascade);
    }
}

public class AnnouncementReadConfiguration : IEntityTypeConfiguration<AnnouncementRead>
{
    public void Configure(EntityTypeBuilder<AnnouncementRead> b)
    {
        b.ToTable("AnnouncementReads");
        b.HasKey(ar => new { ar.AnnouncementId, ar.UserId });
        b.Property(ar => ar.ReadAt).HasDefaultValueSql("GETUTCDATE()");
        b.HasOne(ar => ar.Announcement).WithMany(a => a.Reads).HasForeignKey(ar => ar.AnnouncementId).OnDelete(DeleteBehavior.Cascade);
        b.HasOne(ar => ar.User).WithMany().HasForeignKey(ar => ar.UserId).OnDelete(DeleteBehavior.Cascade);
    }
}

public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> b)
    {
        b.ToTable("Messages");
        b.HasKey(m => m.Id);
        b.Property(m => m.ThreadId).IsRequired();
        b.HasIndex(m => m.ThreadId);
        b.Property(m => m.Subject).HasMaxLength(500);
        b.Property(m => m.SentAt).HasDefaultValueSql("GETUTCDATE()");
        b.HasOne(m => m.FromUser).WithMany().HasForeignKey(m => m.FromUserId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne(m => m.ToUser).WithMany().HasForeignKey(m => m.ToUserId).OnDelete(DeleteBehavior.Restrict);
    }
}

// ── Transport ─────────────────────────────────────────────────────────────

public class VehicleConfiguration : IEntityTypeConfiguration<Vehicle>
{
    public void Configure(EntityTypeBuilder<Vehicle> b)
    {
        b.ToTable("Vehicles");
        b.HasKey(v => v.Id);
        b.Property(v => v.RegistrationNo).HasMaxLength(50).IsRequired();
        b.HasIndex(v => v.RegistrationNo).IsUnique();
        b.Property(v => v.Model).HasMaxLength(200);
        b.Property(v => v.Status).HasConversion<string>().HasMaxLength(20);
    }
}

public class TransportRouteConfiguration : IEntityTypeConfiguration<TransportRoute>
{
    public void Configure(EntityTypeBuilder<TransportRoute> b)
    {
        b.ToTable("TransportRoutes");
        b.HasKey(r => r.Id);
        b.Property(r => r.Name).HasMaxLength(200).IsRequired();
        b.Property(r => r.Description).HasMaxLength(500);
        b.Property(r => r.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        b.HasOne(r => r.Vehicle).WithMany(v => v.Routes).HasForeignKey(r => r.VehicleId).OnDelete(DeleteBehavior.SetNull);
        b.HasOne(r => r.Driver).WithMany().HasForeignKey(r => r.DriverId).OnDelete(DeleteBehavior.SetNull);
    }
}

public class TransportStopConfiguration : IEntityTypeConfiguration<TransportStop>
{
    public void Configure(EntityTypeBuilder<TransportStop> b)
    {
        b.ToTable("TransportStops");
        b.HasKey(s => s.Id);
        b.Property(s => s.Name).HasMaxLength(200).IsRequired();
        b.HasOne(s => s.Route).WithMany(r => r.Stops).HasForeignKey(s => s.RouteId).OnDelete(DeleteBehavior.Cascade);
    }
}

// ── Library ───────────────────────────────────────────────────────────────

public class BookConfiguration : IEntityTypeConfiguration<Book>
{
    public void Configure(EntityTypeBuilder<Book> b)
    {
        b.ToTable("Books");
        b.HasKey(bk => bk.Id);
        b.Property(bk => bk.Isbn).HasMaxLength(20);
        b.HasIndex(bk => bk.Isbn).IsUnique().HasFilter("[Isbn] IS NOT NULL");
        b.Property(bk => bk.Title).HasMaxLength(500).IsRequired();
        b.Property(bk => bk.Author).HasMaxLength(300);
        b.Property(bk => bk.Publisher).HasMaxLength(300);
        b.Property(bk => bk.Category).HasMaxLength(100);
        b.Property(bk => bk.CoverUrl).HasMaxLength(1000);
        b.Property(bk => bk.Location).HasMaxLength(200);
        b.Property(bk => bk.AddedAt).HasDefaultValueSql("GETUTCDATE()");
    }
}

public class BorrowingConfiguration : IEntityTypeConfiguration<Borrowing>
{
    public void Configure(EntityTypeBuilder<Borrowing> b)
    {
        b.ToTable("Borrowings");
        b.HasKey(br => br.Id);
        b.Property(br => br.BorrowerType).HasConversion<string>().HasMaxLength(20);
        b.Property(br => br.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(br => br.FineAmount).HasColumnType("decimal(10,2)");
        b.HasOne(br => br.Book).WithMany(bk => bk.Borrowings).HasForeignKey(br => br.BookId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne(br => br.Borrower).WithMany().HasForeignKey(br => br.BorrowerId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne(br => br.IssuedByUser).WithMany().HasForeignKey(br => br.IssuedBy).OnDelete(DeleteBehavior.SetNull);
    }
}

// ── Admissions ────────────────────────────────────────────────────────────

public class AdmissionApplicationConfiguration : IEntityTypeConfiguration<AdmissionApplication>
{
    public void Configure(EntityTypeBuilder<AdmissionApplication> b)
    {
        b.ToTable("AdmissionApplications");
        b.HasKey(a => a.Id);
        b.Property(a => a.ApplicationNo).HasMaxLength(30).IsRequired();
        b.HasIndex(a => a.ApplicationNo).IsUnique();
        b.Property(a => a.ChildFirstName).HasMaxLength(100).IsRequired();
        b.Property(a => a.ChildLastName).HasMaxLength(100).IsRequired();
        b.Property(a => a.Gender).HasConversion<string>().HasMaxLength(10);
        b.Property(a => a.ApplyingForGrade).HasMaxLength(50).IsRequired();
        b.Property(a => a.PreviousSchool).HasMaxLength(300);
        b.Property(a => a.ParentFirstName).HasMaxLength(100).IsRequired();
        b.Property(a => a.ParentLastName).HasMaxLength(100).IsRequired();
        b.Property(a => a.ParentEmail).HasMaxLength(320).IsRequired();
        b.Property(a => a.ParentPhone).HasMaxLength(50);
        b.Property(a => a.Address).HasMaxLength(500);
        b.Property(a => a.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(a => a.Notes).HasMaxLength(2000);
        b.Property(a => a.SubmittedAt).HasDefaultValueSql("GETUTCDATE()");
        b.HasOne(a => a.AssignedToUser).WithMany().HasForeignKey(a => a.AssignedTo).OnDelete(DeleteBehavior.SetNull);
        b.HasOne(a => a.LinkedStudent).WithMany().HasForeignKey(a => a.LinkedStudentId).OnDelete(DeleteBehavior.SetNull);
    }
}

public class AdmissionDocumentConfiguration : IEntityTypeConfiguration<AdmissionDocument>
{
    public void Configure(EntityTypeBuilder<AdmissionDocument> b)
    {
        b.ToTable("AdmissionDocuments");
        b.HasKey(d => d.Id);
        b.Property(d => d.Name).HasMaxLength(200);
        b.Property(d => d.Url).HasMaxLength(1000).IsRequired();
        b.Property(d => d.UploadedAt).HasDefaultValueSql("GETUTCDATE()");
        b.HasOne(d => d.Application).WithMany(a => a.Documents).HasForeignKey(d => d.ApplicationId).OnDelete(DeleteBehavior.Cascade);
    }
}

// ── CMS ───────────────────────────────────────────────────────────────────

public class ContentPageConfiguration : IEntityTypeConfiguration<ContentPage>
{
    public void Configure(EntityTypeBuilder<ContentPage> b)
    {
        b.ToTable("ContentPages");
        b.HasKey(p => p.Id);
        b.Property(p => p.Slug).HasMaxLength(200).IsRequired();
        b.HasIndex(p => p.Slug).IsUnique();
        b.Property(p => p.Title).HasMaxLength(500).IsRequired();
        b.Property(p => p.MetaDescription).HasMaxLength(500);
        b.Property(p => p.HeroImageUrl).HasMaxLength(1000);
        b.Property(p => p.HeroTitle).HasMaxLength(500);
        b.Property(p => p.HeroSubtitle).HasMaxLength(1000);
        b.HasOne(p => p.Editor).WithMany().HasForeignKey(p => p.LastEditedBy).OnDelete(DeleteBehavior.SetNull);
    }
}

public class ContentSectionConfiguration : IEntityTypeConfiguration<ContentSection>
{
    public void Configure(EntityTypeBuilder<ContentSection> b)
    {
        b.ToTable("ContentSections");
        b.HasKey(s => s.Id);
        b.Property(s => s.SectionKey).HasMaxLength(100);
        b.Property(s => s.Title).HasMaxLength(500);
        b.Property(s => s.ImageUrl).HasMaxLength(1000);
        b.HasOne(s => s.Page).WithMany(p => p.Sections).HasForeignKey(s => s.PageId).OnDelete(DeleteBehavior.Cascade);
    }
}

public class BlogPostConfiguration : IEntityTypeConfiguration<BlogPost>
{
    public void Configure(EntityTypeBuilder<BlogPost> b)
    {
        b.ToTable("BlogPosts");
        b.HasKey(p => p.Id);
        b.Property(p => p.Slug).HasMaxLength(300).IsRequired();
        b.HasIndex(p => p.Slug).IsUnique();
        b.Property(p => p.Title).HasMaxLength(500).IsRequired();
        b.Property(p => p.Excerpt).HasMaxLength(1000);
        b.Property(p => p.FeaturedImageUrl).HasMaxLength(1000);
        b.Property(p => p.Category).HasMaxLength(100);
        b.Property(p => p.Tags).HasMaxLength(500);
        b.Property(p => p.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        b.HasOne(p => p.Author).WithMany().HasForeignKey(p => p.AuthorId).OnDelete(DeleteBehavior.SetNull);
    }
}

public class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> b)
    {
        b.ToTable("Events");
        b.HasKey(e => e.Id);
        b.Property(e => e.Title).HasMaxLength(500).IsRequired();
        b.Property(e => e.ImageUrl).HasMaxLength(1000);
        b.Property(e => e.Location).HasMaxLength(300);
        b.Property(e => e.Category).HasMaxLength(100);
        b.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        b.HasOne(e => e.Creator).WithMany().HasForeignKey(e => e.CreatedBy).OnDelete(DeleteBehavior.SetNull);
    }
}

public class GalleryAlbumConfiguration : IEntityTypeConfiguration<GalleryAlbum>
{
    public void Configure(EntityTypeBuilder<GalleryAlbum> b)
    {
        b.ToTable("GalleryAlbums");
        b.HasKey(a => a.Id);
        b.Property(a => a.Title).HasMaxLength(300).IsRequired();
        b.Property(a => a.CoverImageUrl).HasMaxLength(1000);
        b.Property(a => a.Category).HasMaxLength(100);
        b.Property(a => a.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
    }
}

public class GalleryImageConfiguration : IEntityTypeConfiguration<GalleryImage>
{
    public void Configure(EntityTypeBuilder<GalleryImage> b)
    {
        b.ToTable("GalleryImages");
        b.HasKey(i => i.Id);
        b.Property(i => i.Url).HasMaxLength(1000).IsRequired();
        b.Property(i => i.ThumbnailUrl).HasMaxLength(1000);
        b.Property(i => i.Caption).HasMaxLength(500);
        b.Property(i => i.UploadedAt).HasDefaultValueSql("GETUTCDATE()");
        b.HasOne(i => i.Album).WithMany(a => a.Images).HasForeignKey(i => i.AlbumId).OnDelete(DeleteBehavior.Cascade);
        b.HasOne(i => i.Uploader).WithMany().HasForeignKey(i => i.UploadedBy).OnDelete(DeleteBehavior.SetNull);
    }
}

public class MediaAssetConfiguration : IEntityTypeConfiguration<MediaAsset>
{
    public void Configure(EntityTypeBuilder<MediaAsset> b)
    {
        b.ToTable("MediaAssets");
        b.HasKey(m => m.Id);
        b.Property(m => m.Name).HasMaxLength(300).IsRequired();
        b.Property(m => m.Url).HasMaxLength(1000).IsRequired();
        b.Property(m => m.ThumbnailUrl).HasMaxLength(1000);
        b.Property(m => m.Type).HasConversion<string>().HasMaxLength(20);
        b.Property(m => m.MimeType).HasMaxLength(100);
        b.Property(m => m.Category).HasMaxLength(100);
        b.Property(m => m.UploadedAt).HasDefaultValueSql("GETUTCDATE()");
        b.HasOne(m => m.Uploader).WithMany().HasForeignKey(m => m.UploadedBy).OnDelete(DeleteBehavior.SetNull);
    }
}

// ── System ────────────────────────────────────────────────────────────────

public class SystemSettingsConfiguration : IEntityTypeConfiguration<SystemSettings>
{
    public void Configure(EntityTypeBuilder<SystemSettings> b)
    {
        b.ToTable("SystemSettings");
        b.HasKey(s => s.Id);
        b.Property(s => s.Id).HasDefaultValue(1);
        b.ToTable(t => t.HasCheckConstraint("CK_SystemSettings_SingleRow", "[Id] = 1"));
        b.Property(s => s.SchoolName).HasMaxLength(300).IsRequired();
        b.Property(s => s.SchoolMotto).HasMaxLength(500);
        b.Property(s => s.County).HasMaxLength(100);
        b.Property(s => s.Town).HasMaxLength(100);
        b.Property(s => s.Address).HasMaxLength(500);
        b.Property(s => s.PoBox).HasMaxLength(100);
        b.Property(s => s.Phone).HasMaxLength(50);
        b.Property(s => s.SecondaryPhone).HasMaxLength(50);
        b.Property(s => s.Email).HasMaxLength(320);
        b.Property(s => s.AdmissionsEmail).HasMaxLength(320);
        b.Property(s => s.Website).HasMaxLength(300);
        b.Property(s => s.WhatsApp).HasMaxLength(50);
        b.Property(s => s.GoogleMapsUrl).HasMaxLength(1000);
        b.Property(s => s.OfficeHours).HasMaxLength(300);
        b.Property(s => s.Logo).HasMaxLength(1000);
        b.Property(s => s.PrimaryColor).HasMaxLength(20);
        b.Property(s => s.SmtpHost).HasMaxLength(300);
        b.Property(s => s.SmtpUser).HasMaxLength(300);
        b.Property(s => s.SmtpPasswordEncrypted).HasMaxLength(500);
        b.Property(s => s.MaintenanceMessage).HasMaxLength(1000);
        b.HasOne(s => s.CurrentAcademicYear).WithMany().HasForeignKey(s => s.CurrentAcademicYearId).OnDelete(DeleteBehavior.SetNull);
        b.HasOne(s => s.CurrentTerm).WithMany().HasForeignKey(s => s.CurrentTermId).OnDelete(DeleteBehavior.SetNull);
        b.HasOne(s => s.UpdatedByUser).WithMany().HasForeignKey(s => s.UpdatedBy).OnDelete(DeleteBehavior.SetNull);
    }
}

public class SocialLinkConfiguration : IEntityTypeConfiguration<SocialLink>
{
    public void Configure(EntityTypeBuilder<SocialLink> b)
    {
        b.ToTable("SocialLinks");
        b.HasKey(s => s.Id);
        b.Property(s => s.Platform).HasMaxLength(50).IsRequired();
        b.HasIndex(s => s.Platform).IsUnique();
        b.Property(s => s.Url).HasMaxLength(1000);
    }
}

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> b)
    {
        b.ToTable("Notifications");
        b.HasKey(n => n.Id);
        b.Property(n => n.Id).UseIdentityColumn();
        b.Property(n => n.Title).HasMaxLength(300).IsRequired();
        b.Property(n => n.Body).HasMaxLength(1000);
        b.Property(n => n.Type).HasMaxLength(50);
        b.Property(n => n.ResourceType).HasMaxLength(50);
        b.Property(n => n.ResourceId).HasMaxLength(50);
        b.Property(n => n.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        b.HasOne(n => n.User).WithMany().HasForeignKey(n => n.UserId).OnDelete(DeleteBehavior.Cascade);
    }
}
