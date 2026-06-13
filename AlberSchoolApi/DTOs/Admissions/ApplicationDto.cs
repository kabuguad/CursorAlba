namespace DTOs.Admissions;

public class ApplicationDto
{
    public string Id { get; set; } = string.Empty;
    public string childFirstName { get; set; } = string.Empty;
    public string childLastName { get; set; } = string.Empty;
    public string dob { get; set; } = string.Empty;
    public string gender { get; set; } = string.Empty;
    public string? previousSchool { get; set; }
    public int? applyingForClassId { get; set; }
    public string? applyingForGrade { get; set; }
    public string parentFirstName { get; set; } = string.Empty;
    public string parentLastName { get; set; } = string.Empty;
    public string parentEmail { get; set; } = string.Empty;
    public string parentPhone { get; set; } = string.Empty;
    public string parentRelationship { get; set; } = "Parent/Guardian";
    public string address { get; set; } = string.Empty;
    public string[] documents { get; set; } = Array.Empty<string>();
    public string status { get; set; } = string.Empty;
    public string? notes { get; set; }
    public string submittedDate { get; set; } = string.Empty;
    public string? assignedTo { get; set; }
    public string? reviewedAt { get; set; }
}