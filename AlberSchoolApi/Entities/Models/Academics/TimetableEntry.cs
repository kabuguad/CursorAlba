using Entities.Models.Shared;

namespace Entities.Models.Academics;

public class TimetableEntry : BaseEntity
{
    public int ClassId { get; set; }
    public Class? Class { get; set; }

    public int SubjectId { get; set; }
    public Subject? Subject { get; set; }

    public int? TeacherId { get; set; }
    public User.Teacher? Teacher { get; set; }

    public DayOfWeek DayOfWeek { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
}
