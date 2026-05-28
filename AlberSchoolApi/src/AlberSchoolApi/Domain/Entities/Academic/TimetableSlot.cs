using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.Academic;

public class TimetableSlot : BaseEntity
{
    public int ClassId { get; set; }
    public int SubjectId { get; set; }
    public int TeacherId { get; set; }
    /// <summary>1 = Monday … 5 = Friday</summary>
    public int DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public string? Room { get; set; }
    public int AcademicYearId { get; set; }

    public SchoolClass Class { get; set; } = null!;
    public Subject Subject { get; set; } = null!;
    public People.StaffMember Teacher { get; set; } = null!;
    public AcademicYear AcademicYear { get; set; } = null!;
}
