using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Application.DTOs.Students;

public record StudentListDto(
    int Id,
    string AdmNo,
    string FirstName,
    string LastName,
    string FullName,
    string? Grade,
    Gender? Gender,
    StudentStatus Status,
    string? Photo,
    EmergencyContactDto? PrimaryContact
);

public record StudentDetailDto(
    int Id,
    string AdmNo,
    string FirstName,
    string LastName,
    DateOnly? DateOfBirth,
    Gender? Gender,
    string? Photo,
    string? Address,
    string? MedicalNotes,
    string? SpecialNeeds,
    string? PreviousSchool,
    StudentStatus Status,
    DateOnly? EnrolledDate,
    int? TransportRouteId,
    string? TransportRouteName,
    IEnumerable<EmergencyContactDto> EmergencyContacts,
    DateTime CreatedAt
);

public record EmergencyContactDto(
    int Id,
    string Name,
    string Phone,
    string? Relation,
    bool IsPrimary
);

public record CreateStudentRequest(
    string FirstName,
    string LastName,
    DateOnly? DateOfBirth,
    Gender? Gender,
    string? Address,
    string? MedicalNotes,
    string? SpecialNeeds,
    string? PreviousSchool,
    int? TransportRouteId,
    EmergencyContactRequest PrimaryContact
);

public record EmergencyContactRequest(string Name, string Phone, string? Relation);

public record UpdateStudentRequest(
    string FirstName,
    string LastName,
    DateOnly? DateOfBirth,
    Gender? Gender,
    string? Address,
    string? MedicalNotes,
    string? SpecialNeeds,
    string? PreviousSchool,
    int? TransportRouteId
);

public record UpdateStudentStatusRequest(StudentStatus Status);

public record StudentStatsDto(
    int Total,
    int Active,
    int Graduated,
    int Suspended,
    Dictionary<string, int> ByGrade
);
