using AlberSchoolApi.Domain.Entities.Common;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.Academic;

public class MeetingSlot : BaseEntity
{
    public int TeacherId { get; set; }
    public DateOnly MeetingDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public MeetingSlotStatus Status { get; set; } = MeetingSlotStatus.Available;
    public int? BookedByUserId { get; set; }
    public int? StudentId { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public People.StaffMember Teacher { get; set; } = null!;
    public Identity.User? BookedByUser { get; set; }
    public People.Student? Student { get; set; }
}
