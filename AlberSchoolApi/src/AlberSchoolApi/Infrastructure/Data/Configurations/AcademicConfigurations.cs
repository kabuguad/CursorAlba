using AlberSchoolApi.Domain.Entities.Academic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AlberSchoolApi.Infrastructure.Data.Configurations;

public class AcademicYearConfiguration : IEntityTypeConfiguration<AcademicYear>
{
    public void Configure(EntityTypeBuilder<AcademicYear> b)
    {
        b.ToTable("AcademicYears");
        b.HasKey(a => a.Id);
        b.Property(a => a.Name).HasMaxLength(50).IsRequired();
        b.HasIndex(a => a.Name).IsUnique();
        b.Property(a => a.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(a => a.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
    }
}

public class TermConfiguration : IEntityTypeConfiguration<Term>
{
    public void Configure(EntityTypeBuilder<Term> b)
    {
        b.ToTable("Terms");
        b.HasKey(t => t.Id);
        b.Property(t => t.Name).HasMaxLength(50).IsRequired();
        b.Property(t => t.Status).HasConversion<string>().HasMaxLength(20);
        b.HasIndex(t => new { t.AcademicYearId, t.Name }).IsUnique();
        b.HasOne(t => t.AcademicYear).WithMany(y => y.Terms).HasForeignKey(t => t.AcademicYearId).OnDelete(DeleteBehavior.Cascade);
    }
}

public class SchoolClassConfiguration : IEntityTypeConfiguration<SchoolClass>
{
    public void Configure(EntityTypeBuilder<SchoolClass> b)
    {
        b.ToTable("SchoolClasses");
        b.HasKey(c => c.Id);
        b.Property(c => c.Name).HasMaxLength(100).IsRequired();
        b.Property(c => c.Grade).HasMaxLength(50).IsRequired();
        b.Property(c => c.Stream).HasMaxLength(20);
        b.Property(c => c.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        b.HasOne(c => c.AcademicYear).WithMany(y => y.Classes).HasForeignKey(c => c.AcademicYearId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne(c => c.ClassTeacher).WithMany().HasForeignKey(c => c.ClassTeacherId).OnDelete(DeleteBehavior.SetNull);
    }
}

public class SubjectConfiguration : IEntityTypeConfiguration<Subject>
{
    public void Configure(EntityTypeBuilder<Subject> b)
    {
        b.ToTable("Subjects");
        b.HasKey(s => s.Id);
        b.Property(s => s.Code).HasMaxLength(20).IsRequired();
        b.HasIndex(s => s.Code).IsUnique();
        b.Property(s => s.Name).HasMaxLength(200).IsRequired();
        b.Property(s => s.Description).HasMaxLength(1000);
        b.Property(s => s.GradeLevel).HasMaxLength(50);
    }
}

public class ClassSubjectConfiguration : IEntityTypeConfiguration<ClassSubject>
{
    public void Configure(EntityTypeBuilder<ClassSubject> b)
    {
        b.ToTable("ClassSubjects");
        b.HasKey(cs => new { cs.ClassId, cs.SubjectId, cs.AcademicYearId });
        b.HasOne(cs => cs.Class).WithMany(c => c.ClassSubjects).HasForeignKey(cs => cs.ClassId).OnDelete(DeleteBehavior.Cascade);
        b.HasOne(cs => cs.Subject).WithMany(s => s.ClassSubjects).HasForeignKey(cs => cs.SubjectId).OnDelete(DeleteBehavior.Cascade);
        b.HasOne(cs => cs.AcademicYear).WithMany().HasForeignKey(cs => cs.AcademicYearId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne(cs => cs.Teacher).WithMany().HasForeignKey(cs => cs.TeacherId).OnDelete(DeleteBehavior.SetNull);
    }
}

public class EnrollmentConfiguration : IEntityTypeConfiguration<Enrollment>
{
    public void Configure(EntityTypeBuilder<Enrollment> b)
    {
        b.ToTable("Enrollments");
        b.HasKey(e => e.Id);
        b.Property(e => e.Status).HasConversion<string>().HasMaxLength(20);
        b.HasIndex(e => new { e.StudentId, e.ClassId, e.AcademicYearId }).IsUnique();
        b.HasOne(e => e.Student).WithMany(s => s.Enrollments).HasForeignKey(e => e.StudentId).OnDelete(DeleteBehavior.Cascade);
        b.HasOne(e => e.Class).WithMany(c => c.Enrollments).HasForeignKey(e => e.ClassId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne(e => e.AcademicYear).WithMany().HasForeignKey(e => e.AcademicYearId).OnDelete(DeleteBehavior.Restrict);
    }
}

public class AssessmentSchemeConfiguration : IEntityTypeConfiguration<AssessmentScheme>
{
    public void Configure(EntityTypeBuilder<AssessmentScheme> b)
    {
        b.ToTable("AssessmentSchemes");
        b.HasKey(s => s.Id);
        b.Property(s => s.Name).HasMaxLength(200).IsRequired();
        b.Property(s => s.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
    }
}

public class AssessmentBandConfiguration : IEntityTypeConfiguration<AssessmentBand>
{
    public void Configure(EntityTypeBuilder<AssessmentBand> b)
    {
        b.ToTable("AssessmentBands");
        b.HasKey(band => band.Id);
        b.Property(band => band.Label).HasMaxLength(50).IsRequired();
        b.Property(band => band.MinScore).HasColumnType("decimal(5,2)");
        b.Property(band => band.MaxScore).HasColumnType("decimal(5,2)");
        b.HasOne(band => band.Scheme).WithMany(s => s.Bands).HasForeignKey(band => band.SchemeId).OnDelete(DeleteBehavior.Cascade);
    }
}

public class ExamConfiguration : IEntityTypeConfiguration<Exam>
{
    public void Configure(EntityTypeBuilder<Exam> b)
    {
        b.ToTable("Exams");
        b.HasKey(e => e.Id);
        b.Property(e => e.Name).HasMaxLength(200).IsRequired();
        b.Property(e => e.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        b.HasOne(e => e.Term).WithMany(t => t.Exams).HasForeignKey(e => e.TermId).OnDelete(DeleteBehavior.Restrict);
    }
}

public class ExamGradeConfiguration : IEntityTypeConfiguration<ExamGrade>
{
    public void Configure(EntityTypeBuilder<ExamGrade> b)
    {
        b.ToTable("ExamGrades");
        b.HasKey(eg => new { eg.ExamId, eg.Grade });
        b.Property(eg => eg.Grade).HasMaxLength(50).IsRequired();
        b.HasOne(eg => eg.Exam).WithMany(e => e.ExamGrades).HasForeignKey(eg => eg.ExamId).OnDelete(DeleteBehavior.Cascade);
    }
}

public class StudentResultConfiguration : IEntityTypeConfiguration<StudentResult>
{
    public void Configure(EntityTypeBuilder<StudentResult> b)
    {
        b.ToTable("StudentResults");
        b.HasKey(r => r.Id);
        b.Property(r => r.Score).HasColumnType("decimal(5,2)");
        b.Property(r => r.Grade).HasMaxLength(10);
        b.Property(r => r.Band).HasMaxLength(50);
        b.Property(r => r.TeacherRemarks).HasMaxLength(1000);
        b.Property(r => r.RecordedAt).HasDefaultValueSql("GETUTCDATE()");
        b.HasIndex(r => new { r.StudentId, r.ExamId, r.SubjectId }).IsUnique();
        b.HasOne(r => r.Student).WithMany().HasForeignKey(r => r.StudentId).OnDelete(DeleteBehavior.Cascade);
        b.HasOne(r => r.Exam).WithMany(e => e.Results).HasForeignKey(r => r.ExamId).OnDelete(DeleteBehavior.Cascade);
        b.HasOne(r => r.Subject).WithMany(s => s.StudentResults).HasForeignKey(r => r.SubjectId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne(r => r.Recorder).WithMany().HasForeignKey(r => r.RecordedBy).OnDelete(DeleteBehavior.SetNull);
    }
}

public class TimetableSlotConfiguration : IEntityTypeConfiguration<TimetableSlot>
{
    public void Configure(EntityTypeBuilder<TimetableSlot> b)
    {
        b.ToTable("TimetableSlots");
        b.HasKey(t => t.Id);
        b.Property(t => t.Room).HasMaxLength(100);
        b.HasOne(t => t.Class).WithMany(c => c.TimetableSlots).HasForeignKey(t => t.ClassId).OnDelete(DeleteBehavior.Cascade);
        b.HasOne(t => t.Subject).WithMany(s => s.TimetableSlots).HasForeignKey(t => t.SubjectId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne(t => t.Teacher).WithMany(sm => sm.TimetableSlots).HasForeignKey(t => t.TeacherId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne(t => t.AcademicYear).WithMany().HasForeignKey(t => t.AcademicYearId).OnDelete(DeleteBehavior.Restrict);
    }
}

public class HomeworkConfiguration : IEntityTypeConfiguration<Homework>
{
    public void Configure(EntityTypeBuilder<Homework> b)
    {
        b.ToTable("Homeworks");
        b.HasKey(h => h.Id);
        b.Property(h => h.Title).HasMaxLength(500).IsRequired();
        b.Property(h => h.AttachmentUrl).HasMaxLength(1000);
        b.Property(h => h.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        b.HasOne(h => h.Class).WithMany(c => c.Homeworks).HasForeignKey(h => h.ClassId).OnDelete(DeleteBehavior.Cascade);
        b.HasOne(h => h.Subject).WithMany().HasForeignKey(h => h.SubjectId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne(h => h.Teacher).WithMany(sm => sm.Homeworks).HasForeignKey(h => h.TeacherId).OnDelete(DeleteBehavior.Restrict);
    }
}

public class AttendanceRecordConfiguration : IEntityTypeConfiguration<AttendanceRecord>
{
    public void Configure(EntityTypeBuilder<AttendanceRecord> b)
    {
        b.ToTable("AttendanceRecords");
        b.HasKey(a => a.Id);
        b.Property(a => a.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(a => a.Notes).HasMaxLength(500);
        b.HasIndex(a => new { a.StudentId, a.Date }).IsUnique();
        b.HasOne(a => a.Student).WithMany().HasForeignKey(a => a.StudentId).OnDelete(DeleteBehavior.Cascade);
        b.HasOne(a => a.Class).WithMany(c => c.AttendanceRecords).HasForeignKey(a => a.ClassId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne(a => a.Recorder).WithMany().HasForeignKey(a => a.RecordedBy).OnDelete(DeleteBehavior.SetNull);
    }
}

public class LeaveRequestConfiguration : IEntityTypeConfiguration<LeaveRequest>
{
    public void Configure(EntityTypeBuilder<LeaveRequest> b)
    {
        b.ToTable("LeaveRequests");
        b.HasKey(l => l.Id);
        b.Property(l => l.Type).HasConversion<string>().HasMaxLength(30);
        b.Property(l => l.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(l => l.Reason).HasMaxLength(1000);
        b.Property(l => l.ReviewNotes).HasMaxLength(500);
        b.Property(l => l.SubmittedAt).HasDefaultValueSql("GETUTCDATE()");
        b.HasOne(l => l.StaffMember).WithMany(sm => sm.LeaveRequests).HasForeignKey(l => l.StaffMemberId).OnDelete(DeleteBehavior.Cascade);
        b.HasOne(l => l.Reviewer).WithMany().HasForeignKey(l => l.ReviewedBy).OnDelete(DeleteBehavior.SetNull);
    }
}

public class MeetingSlotConfiguration : IEntityTypeConfiguration<MeetingSlot>
{
    public void Configure(EntityTypeBuilder<MeetingSlot> b)
    {
        b.ToTable("MeetingSlots");
        b.HasKey(m => m.Id);
        b.Property(m => m.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(m => m.Notes).HasMaxLength(1000);
        b.Property(m => m.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        b.HasOne(m => m.Teacher).WithMany(sm => sm.MeetingSlots).HasForeignKey(m => m.TeacherId).OnDelete(DeleteBehavior.Cascade);
        b.HasOne(m => m.BookedByUser).WithMany().HasForeignKey(m => m.BookedByUserId).OnDelete(DeleteBehavior.SetNull);
        b.HasOne(m => m.Student).WithMany().HasForeignKey(m => m.StudentId).OnDelete(DeleteBehavior.SetNull);
    }
}
