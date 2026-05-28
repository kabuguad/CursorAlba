using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.Academic;

public class SchoolClass : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Grade { get; set; } = string.Empty;
    public string? Stream { get; set; }
    public int? ClassTeacherId { get; set; }
    public int AcademicYearId { get; set; }
    public int Capacity { get; set; } = 45;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public AcademicYear AcademicYear { get; set; } = null!;
    public People.StaffMember? ClassTeacher { get; set; }
    public ICollection<ClassSubject> ClassSubjects { get; set; } = [];
    public ICollection<Enrollment> Enrollments { get; set; } = [];
    public ICollection<TimetableSlot> TimetableSlots { get; set; } = [];
    public ICollection<Homework> Homeworks { get; set; } = [];
    public ICollection<AttendanceRecord> AttendanceRecords { get; set; } = [];
}
