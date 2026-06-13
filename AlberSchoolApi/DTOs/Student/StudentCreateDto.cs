namespace DTOs.Student;

public class StudentCreateDto
{
    public int ClassId { get; set; }
    public int? ParentId { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? Address { get; set; }
}