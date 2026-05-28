using AlberSchoolApi.Domain.Entities.Common;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.Academic;

public class AcademicYear : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public bool IsCurrent { get; set; } = false;
    public YearStatus Status { get; set; } = YearStatus.Upcoming;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Term> Terms { get; set; } = [];
    public ICollection<SchoolClass> Classes { get; set; } = [];
}
