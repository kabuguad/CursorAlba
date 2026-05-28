using AlberSchoolApi.Domain.Entities.Academic;

namespace AlberSchoolApi.Domain.Entities.People;

/// <summary>Many-to-many: subjects a staff member is qualified to teach.</summary>
public class StaffSubject
{
    public int StaffMemberId { get; set; }
    public int SubjectId { get; set; }

    public StaffMember StaffMember { get; set; } = null!;
    public Subject Subject { get; set; } = null!;
}
