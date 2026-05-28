using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.Academic;

public class Subject : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsCompulsory { get; set; } = false;
    /// <summary>NULL = applies to all grade levels.</summary>
    public string? GradeLevel { get; set; }

    public ICollection<ClassSubject> ClassSubjects { get; set; } = [];
    public ICollection<People.StaffSubject> StaffSubjects { get; set; } = [];
    public ICollection<TimetableSlot> TimetableSlots { get; set; } = [];
    public ICollection<StudentResult> StudentResults { get; set; } = [];
}
