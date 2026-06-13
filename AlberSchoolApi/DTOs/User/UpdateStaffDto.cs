namespace DTOs.User;

public record UpdateStaffDto(
    string FirstName,
    string LastName,
    string Email,
    string? Qualification,
    string? Specialization,
    DateTime? HireDate
);