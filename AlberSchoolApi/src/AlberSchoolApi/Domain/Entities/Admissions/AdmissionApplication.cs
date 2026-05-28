using AlberSchoolApi.Domain.Entities.Common;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.Admissions;

public class AdmissionApplication : BaseEntity
{
    public string ApplicationNo { get; set; } = string.Empty;
    public string ChildFirstName { get; set; } = string.Empty;
    public string ChildLastName { get; set; } = string.Empty;
    public DateOnly? DateOfBirth { get; set; }
    public Gender? Gender { get; set; }
    public string ApplyingForGrade { get; set; } = string.Empty;
    public string? PreviousSchool { get; set; }
    public string ParentFirstName { get; set; } = string.Empty;
    public string ParentLastName { get; set; } = string.Empty;
    public string ParentEmail { get; set; } = string.Empty;
    public string? ParentPhone { get; set; }
    public string? Address { get; set; }
    public AdmissionStatus Status { get; set; } = AdmissionStatus.Pending;
    public int? AssignedTo { get; set; }
    public string? Notes { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReviewedAt { get; set; }
    /// <summary>Populated after application is approved and student record created.</summary>
    public int? LinkedStudentId { get; set; }

    public Identity.User? AssignedToUser { get; set; }
    public People.Student? LinkedStudent { get; set; }
    public ICollection<AdmissionDocument> Documents { get; set; } = [];
}
