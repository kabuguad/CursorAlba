namespace DTOs.Grade;

public class GradeCreateDto
{
    public int StudentId { get; set; }
    public int SubjectId { get; set; }
    public decimal Score { get; set; }
    public decimal MaxScore { get; set; }
    public string? AssessmentType { get; set; }
    public DateTime AssessmentDate { get; set; }
    public string? Remarks { get; set; }
}
