namespace DTOs.Academics;

public class TimetableEntryDto
{
    public int Id { get; set; }
    public string DayOfWeek { get; set; } = string.Empty;
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public string SubjectName { get; set; } = string.Empty;
    public string? SubjectCode { get; set; }
    public string TeacherName { get; set; } = string.Empty;
    public int ClassId { get; set; }
    public string? ClassName { get; set; }
}
