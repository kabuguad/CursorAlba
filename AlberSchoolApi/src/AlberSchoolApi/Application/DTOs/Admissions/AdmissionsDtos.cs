using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Application.DTOs.Admissions;

public record AdmissionListDto(
    int Id,
    string ApplicationNo,
    string ChildFirstName,
    string ChildLastName,
    string ApplyingForGrade,
    string ParentEmail,
    string? ParentPhone,
    AdmissionStatus Status,
    DateTime SubmittedAt
);

public record AdmissionDetailDto(
    int Id,
    string ApplicationNo,
    string ChildFirstName,
    string ChildLastName,
    DateOnly? DateOfBirth,
    Gender? Gender,
    string ApplyingForGrade,
    string? PreviousSchool,
    string ParentFirstName,
    string ParentLastName,
    string ParentEmail,
    string? ParentPhone,
    string? Address,
    AdmissionStatus Status,
    string? AssignedToName,
    string? Notes,
    DateTime SubmittedAt,
    DateTime? ReviewedAt,
    int? LinkedStudentId,
    IEnumerable<DocumentDto> Documents
);

public record DocumentDto(int Id, string? Name, string Url, DateTime UploadedAt);

public record SubmitApplicationRequest(
    string ChildFirstName,
    string ChildLastName,
    DateOnly? DateOfBirth,
    Gender? Gender,
    string ApplyingForGrade,
    string? PreviousSchool,
    string ParentFirstName,
    string ParentLastName,
    string ParentEmail,
    string? ParentPhone,
    string? Address
);

public record ReviewApplicationRequest(AdmissionStatus Status, string? Notes, int? AssignedTo);
public record ApproveApplicationRequest(string? Notes);
