namespace DTOs.Admissions;

public class CreateApplicationDto
{
    public string ChildFirstName { get; set; } = string.Empty;
    public string ChildLastName { get; set; } = string.Empty;
    public string Dob { get; set; } = string.Empty;
    public string? Gender { get; set; }
    public string? PreviousSchool { get; set; }
    public int? ApplyingForClassId { get; set; }
    public string ParentFirstName { get; set; } = string.Empty;
    public string ParentLastName { get; set; } = string.Empty;
    public string? ParentEmail { get; set; }
    public string? ParentPhone { get; set; }
    public string? Address { get; set; }
}