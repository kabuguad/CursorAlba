using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.People;

public class StudentEmergencyContact : BaseEntity
{
    public int StudentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Relation { get; set; }
    public bool IsPrimary { get; set; } = false;

    public Student Student { get; set; } = null!;
}
