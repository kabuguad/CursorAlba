using AlberSchoolApi.Domain.Entities.Common;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.People;

public class Student : AuditableEntity
{
    public string AdmNo { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateOnly? DateOfBirth { get; set; }
    public Gender? Gender { get; set; }
    public string? Photo { get; set; }
    public string? Address { get; set; }
    public string? MedicalNotes { get; set; }
    public string? SpecialNeeds { get; set; }
    public string? PreviousSchool { get; set; }
    public StudentStatus Status { get; set; } = StudentStatus.Active;
    public DateOnly? EnrolledDate { get; set; }
    public int? TransportRouteId { get; set; }

    // Navigation
    public Transport.TransportRoute? TransportRoute { get; set; }
    public ICollection<StudentEmergencyContact> EmergencyContacts { get; set; } = [];
    public ICollection<StudentParent> StudentParents { get; set; } = [];
    public ICollection<Academic.Enrollment> Enrollments { get; set; } = [];
    public ICollection<Finance.Payment> Payments { get; set; } = [];
    public ICollection<Finance.Invoice> Invoices { get; set; } = [];
    public ICollection<Finance.Scholarship> Scholarships { get; set; } = [];
}
