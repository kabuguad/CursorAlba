using AlberSchoolApi.Domain.Entities.Common;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.Academic;

public class AttendanceRecord : BaseEntity
{
    public int StudentId { get; set; }
    public int ClassId { get; set; }
    public DateOnly Date { get; set; }
    public AttendanceStatus Status { get; set; }
    public int? RecordedBy { get; set; }
    public string? Notes { get; set; }

    public People.Student Student { get; set; } = null!;
    public SchoolClass Class { get; set; } = null!;
    public Identity.User? Recorder { get; set; }
}
