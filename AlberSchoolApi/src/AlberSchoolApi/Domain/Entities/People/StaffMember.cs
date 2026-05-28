using AlberSchoolApi.Domain.Entities.Common;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.People;

public class StaffMember : AuditableEntity
{
    public string StaffNo { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public Gender? Gender { get; set; }
    public string? Photo { get; set; }
    public StaffRole Role { get; set; } = StaffRole.Teacher;
    public string? Department { get; set; }
    public string? Qualification { get; set; }
    public string? TscNo { get; set; }
    public string? NationalId { get; set; }
    public DateOnly? EmployedDate { get; set; }
    public ContractType ContractType { get; set; } = ContractType.Permanent;
    public DateOnly? ContractEnd { get; set; }
    public string? SalaryGrade { get; set; }
    public StaffStatus Status { get; set; } = StaffStatus.Active;
    public string? BankAccount { get; set; }
    public string? NhifNo { get; set; }
    public string? NssfNo { get; set; }
    public string? Address { get; set; }

    // Navigation
    public ICollection<StaffSubject> StaffSubjects { get; set; } = [];
    public ICollection<Academic.LeaveRequest> LeaveRequests { get; set; } = [];
    public ICollection<Academic.TimetableSlot> TimetableSlots { get; set; } = [];
    public ICollection<Academic.MeetingSlot> MeetingSlots { get; set; } = [];
}
