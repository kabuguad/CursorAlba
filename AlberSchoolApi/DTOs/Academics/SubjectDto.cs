namespace DTOs.Academics;

public class SubjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public int ClassId { get; set; }
    public string? ClassName { get; set; }
    public string? ClassSection { get; set; }
}