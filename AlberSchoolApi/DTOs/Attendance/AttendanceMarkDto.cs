namespace DTOs.Attendance;

public class AttendanceMarkDto
{
    public int StudentId { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow.Date;
    public AttendanceStatus Status { get; set; }
    public string? Remarks { get; set; }
}

public enum AttendanceStatus
{
    Present,
    Absent,
    Late,
    Excused
}
