using AlberSchoolApi.Domain.Entities.Common;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.Academic;

public class Enrollment : BaseEntity
{
    public int StudentId { get; set; }
    public int ClassId { get; set; }
    public int AcademicYearId { get; set; }
    public DateOnly EnrolledDate { get; set; }
    public EnrollmentStatus Status { get; set; } = EnrollmentStatus.Active;

    public People.Student Student { get; set; } = null!;
    public SchoolClass Class { get; set; } = null!;
    public AcademicYear AcademicYear { get; set; } = null!;
}
