namespace DTOs.Academics;

public class AssignmentDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime DueDate { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public string? TeacherName { get; set; }
    public string? ClassName { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AssignmentCreateDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime DueDate { get; set; }
    public int ClassId { get; set; }
    public int SubjectId { get; set; }
}
