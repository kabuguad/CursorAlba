namespace DTOs.User;

public class TeacherDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Qualification { get; set; }
    public string? Specialization { get; set; }
    public DateTime? HireDate { get; set; }
}