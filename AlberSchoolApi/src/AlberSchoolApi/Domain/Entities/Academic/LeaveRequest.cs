using AlberSchoolApi.Domain.Entities.Common;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.Academic;

public class LeaveRequest : BaseEntity
{
    public int StaffMemberId { get; set; }
    public LeaveType Type { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? Reason { get; set; }
    public LeaveStatus Status { get; set; } = LeaveStatus.Pending;
    public int? ReviewedBy { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? ReviewNotes { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    public People.StaffMember StaffMember { get; set; } = null!;
    public Identity.User? Reviewer { get; set; }
}
