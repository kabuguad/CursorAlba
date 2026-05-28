using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Application.DTOs.Staff;

public record StaffListDto(
    int Id,
    string StaffNo,
    string FirstName,
    string LastName,
    string FullName,
    string Email,
    string? Phone,
    string? Photo,
    StaffRole Role,
    string? Department,
    ContractType ContractType,
    StaffStatus Status
);

public record StaffDetailDto(
    int Id,
    string StaffNo,
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    DateOnly? DateOfBirth,
    Gender? Gender,
    string? Photo,
    StaffRole Role,
    string? Department,
    string? Qualification,
    string? TscNo,
    string? NationalId,
    DateOnly? EmployedDate,
    ContractType ContractType,
    DateOnly? ContractEnd,
    string? SalaryGrade,
    StaffStatus Status,
    string? Address,
    IEnumerable<SubjectSummaryDto> Subjects,
    DateTime CreatedAt
);

public record SubjectSummaryDto(int Id, string Code, string Name);

public record CreateStaffRequest(
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    DateOnly? DateOfBirth,
    Gender? Gender,
    StaffRole Role,
    string? Department,
    string? Qualification,
    string? TscNo,
    string? NationalId,
    DateOnly? EmployedDate,
    ContractType ContractType,
    DateOnly? ContractEnd,
    string? SalaryGrade,
    string? Address,
    IEnumerable<int> SubjectIds
);

public record UpdateStaffRequest(
    string FirstName,
    string LastName,
    string? Phone,
    DateOnly? DateOfBirth,
    Gender? Gender,
    string? Photo,
    StaffRole Role,
    string? Department,
    string? Qualification,
    string? TscNo,
    string? NationalId,
    ContractType ContractType,
    DateOnly? ContractEnd,
    string? SalaryGrade,
    StaffStatus Status,
    string? Address,
    IEnumerable<int> SubjectIds
);

public record LeaveRequestDto(
    int Id,
    int StaffMemberId,
    string StaffName,
    LeaveType Type,
    DateOnly StartDate,
    DateOnly EndDate,
    string? Reason,
    LeaveStatus Status,
    string? ReviewNotes,
    DateTime SubmittedAt
);

public record CreateLeaveRequestRequest(
    LeaveType Type,
    DateOnly StartDate,
    DateOnly EndDate,
    string? Reason
);

public record ReviewLeaveRequest(LeaveStatus Status, string? Notes);
