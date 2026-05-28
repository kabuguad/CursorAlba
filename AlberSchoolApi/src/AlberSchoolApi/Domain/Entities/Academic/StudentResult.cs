using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.Academic;

public class StudentResult : BaseEntity
{
    public int StudentId { get; set; }
    public int ExamId { get; set; }
    public int SubjectId { get; set; }
    public decimal? Score { get; set; }
    public string? Grade { get; set; }
    public int? Points { get; set; }
    public string? Band { get; set; }
    public string? TeacherRemarks { get; set; }
    public int? RecordedBy { get; set; }
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;

    public People.Student Student { get; set; } = null!;
    public Exam Exam { get; set; } = null!;
    public Subject Subject { get; set; } = null!;
    public Identity.User? Recorder { get; set; }
}
