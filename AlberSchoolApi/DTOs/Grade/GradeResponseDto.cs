namespace DTOs.Grade;

public class GradeResponseDto
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string SubjectName { get; set; } = string.Empty;
    public decimal Score { get; set; }
    public decimal MaxScore { get; set; }
    public decimal Percentage => MaxScore == 0 ? 0 : Math.Round((Score / MaxScore) * 100, 2);
    public string? AssessmentType { get; set; }
    public DateTime AssessmentDate { get; set; }
    public string? Remarks { get; set; }
}
