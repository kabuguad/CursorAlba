namespace DTOs.User;

public record CreateStaffDto(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string? Qualification,
    string? Specialization,
    DateTime? HireDate
);