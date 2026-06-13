namespace DTOs.User;

public class ChildDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string ClassName { get; set; } = string.Empty;
    public int ClassId { get; set; }
    public string? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Address { get; set; }
    public int ParentId { get; set; }
}