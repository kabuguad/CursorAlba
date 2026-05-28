using AlberSchoolApi.Domain.Entities.People;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AlberSchoolApi.Infrastructure.Data.Configurations;

public class StudentConfiguration : IEntityTypeConfiguration<Student>
{
    public void Configure(EntityTypeBuilder<Student> b)
    {
        b.ToTable("Students");
        b.HasKey(s => s.Id);
        b.Property(s => s.AdmNo).HasMaxLength(20).IsRequired();
        b.HasIndex(s => s.AdmNo).IsUnique().HasFilter("[IsDeleted] = 0");
        b.Property(s => s.FirstName).HasMaxLength(100).IsRequired();
        b.Property(s => s.LastName).HasMaxLength(100).IsRequired();
        b.Property(s => s.Gender).HasConversion<string>().HasMaxLength(10);
        b.Property(s => s.Photo).HasMaxLength(1000);
        b.Property(s => s.Address).HasMaxLength(500);
        b.Property(s => s.MedicalNotes).HasMaxLength(2000);
        b.Property(s => s.SpecialNeeds).HasMaxLength(1000);
        b.Property(s => s.PreviousSchool).HasMaxLength(300);
        b.Property(s => s.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(s => s.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

        b.HasOne(s => s.TransportRoute).WithMany(r => r.Students).HasForeignKey(s => s.TransportRouteId).OnDelete(DeleteBehavior.SetNull);
    }
}

public class StudentEmergencyContactConfiguration : IEntityTypeConfiguration<StudentEmergencyContact>
{
    public void Configure(EntityTypeBuilder<StudentEmergencyContact> b)
    {
        b.ToTable("StudentEmergencyContacts");
        b.HasKey(c => c.Id);
        b.Property(c => c.Name).HasMaxLength(200).IsRequired();
        b.Property(c => c.Phone).HasMaxLength(50).IsRequired();
        b.Property(c => c.Relation).HasMaxLength(100);
        b.HasOne(c => c.Student).WithMany(s => s.EmergencyContacts).HasForeignKey(c => c.StudentId).OnDelete(DeleteBehavior.Cascade);
    }
}

public class StudentParentConfiguration : IEntityTypeConfiguration<StudentParent>
{
    public void Configure(EntityTypeBuilder<StudentParent> b)
    {
        b.ToTable("StudentParents");
        b.HasKey(sp => new { sp.StudentId, sp.UserId });
        b.Property(sp => sp.Relationship).HasMaxLength(50);
        b.HasOne(sp => sp.Student).WithMany(s => s.StudentParents).HasForeignKey(sp => sp.StudentId).OnDelete(DeleteBehavior.Cascade);
        b.HasOne(sp => sp.User).WithMany().HasForeignKey(sp => sp.UserId).OnDelete(DeleteBehavior.Cascade);
    }
}

public class StaffMemberConfiguration : IEntityTypeConfiguration<StaffMember>
{
    public void Configure(EntityTypeBuilder<StaffMember> b)
    {
        b.ToTable("StaffMembers");
        b.HasKey(s => s.Id);
        b.Property(s => s.StaffNo).HasMaxLength(20).IsRequired();
        b.HasIndex(s => s.StaffNo).IsUnique().HasFilter("[IsDeleted] = 0");
        b.Property(s => s.FirstName).HasMaxLength(100).IsRequired();
        b.Property(s => s.LastName).HasMaxLength(100).IsRequired();
        b.Property(s => s.Email).HasMaxLength(320).IsRequired();
        b.HasIndex(s => s.Email).IsUnique().HasFilter("[IsDeleted] = 0");
        b.Property(s => s.Phone).HasMaxLength(50);
        b.Property(s => s.Gender).HasConversion<string>().HasMaxLength(10);
        b.Property(s => s.Photo).HasMaxLength(1000);
        b.Property(s => s.Role).HasConversion<string>().HasMaxLength(30);
        b.Property(s => s.Department).HasMaxLength(100);
        b.Property(s => s.Qualification).HasMaxLength(300);
        b.Property(s => s.TscNo).HasMaxLength(50);
        b.Property(s => s.NationalId).HasMaxLength(50);
        b.Property(s => s.SalaryGrade).HasMaxLength(20);
        b.Property(s => s.ContractType).HasConversion<string>().HasMaxLength(20);
        b.Property(s => s.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(s => s.BankAccount).HasMaxLength(50);
        b.Property(s => s.NhifNo).HasMaxLength(50);
        b.Property(s => s.NssfNo).HasMaxLength(50);
        b.Property(s => s.Address).HasMaxLength(500);
        b.Property(s => s.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
    }
}

public class StaffSubjectConfiguration : IEntityTypeConfiguration<StaffSubject>
{
    public void Configure(EntityTypeBuilder<StaffSubject> b)
    {
        b.ToTable("StaffSubjects");
        b.HasKey(ss => new { ss.StaffMemberId, ss.SubjectId });
        b.HasOne(ss => ss.StaffMember).WithMany(s => s.StaffSubjects).HasForeignKey(ss => ss.StaffMemberId).OnDelete(DeleteBehavior.Cascade);
        b.HasOne(ss => ss.Subject).WithMany(s => s.StaffSubjects).HasForeignKey(ss => ss.SubjectId).OnDelete(DeleteBehavior.Cascade);
    }
}
