namespace DTOs.Academics;

public class ClassDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Section { get; set; }
    public string? Description { get; set; }
    public int StudentCount { get; set; }
    public string FullName => $"{Name} {Section}".Trim();
}