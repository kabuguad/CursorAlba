namespace AlberSchoolApi.Domain.Entities.Academic;

/// <summary>Many-to-many: subject offered in a class for a given year, taught by a teacher.</summary>
public class ClassSubject
{
    public int ClassId { get; set; }
    public int SubjectId { get; set; }
    public int AcademicYearId { get; set; }
    public int? TeacherId { get; set; }

    public SchoolClass Class { get; set; } = null!;
    public Subject Subject { get; set; } = null!;
    public AcademicYear AcademicYear { get; set; } = null!;
    public People.StaffMember? Teacher { get; set; }
}
