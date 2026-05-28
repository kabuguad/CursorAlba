using AlberSchoolApi.Domain.Entities.Common;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.Academic;

public class Exam : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public int TermId { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public ExamStatus Status { get; set; } = ExamStatus.Scheduled;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Term Term { get; set; } = null!;
    public ICollection<ExamGrade> ExamGrades { get; set; } = [];
    public ICollection<StudentResult> Results { get; set; } = [];
}

/// <summary>Which grade levels sit this exam.</summary>
public class ExamGrade
{
    public int ExamId { get; set; }
    public string Grade { get; set; } = string.Empty;

    public Exam Exam { get; set; } = null!;
}
