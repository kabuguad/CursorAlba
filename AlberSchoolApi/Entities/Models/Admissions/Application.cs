using Entities.Models.Academics;
using Entities.Models.Shared;

namespace Entities.Models.Admissions;

public class Application : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? PreviousSchool { get; set; }
    public int? ApplyingForClassId { get; set; }
    public Class? ApplyingForClass { get; set; }
    public string? ParentName { get; set; }
    public string? ParentPhone { get; set; }
    public string? ParentEmail { get; set; }
    public string? Address { get; set; }
    public string Status { get; set; } = "Pending";
    public string? ReviewedById { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? ReviewNotes { get; set; }
}