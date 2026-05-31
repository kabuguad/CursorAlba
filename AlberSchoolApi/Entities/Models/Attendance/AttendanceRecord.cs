using Entities.Models.Shared;

namespace Entities.Models.Attendance;

public class AttendanceRecord : BaseEntity
{
    public int StudentId { get; set; }
    public User.Student? Student { get; set; }

    public DateTime Date { get; set; }
    public AttendanceStatus Status { get; set; }
    public string? Remarks { get; set; }
    public int? RecordedById { get; set; }
}

public enum AttendanceStatus
{
    Present,
    Absent,
    Late,
    Excused
}