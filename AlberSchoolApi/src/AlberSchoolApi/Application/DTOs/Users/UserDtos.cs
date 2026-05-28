using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Application.DTOs.Users;

public record UserListDto(
    int Id,
    string Name,
    string Email,
    string? Phone,
    string? Avatar,
    UserRole Role,
    UserStatus Status,
    DateTime? LastLoginAt,
    int PermissionCount
);

public record UserDetailDto(
    int Id,
    string Name,
    string Email,
    string? Phone,
    string? Avatar,
    UserRole Role,
    UserStatus Status,
    int? LinkedProfileId,
    LinkedProfileType? LinkedProfileType,
    DateTime? LastLoginAt,
    DateTime CreatedAt,
    IEnumerable<PermissionDto> Permissions
);

public record PermissionDto(int Id, string Code, string? Description, string? Group);

public record CreateUserRequest(
    string Name,
    string Email,
    string Password,
    string? Phone,
    UserRole Role,
    int? LinkedProfileId,
    LinkedProfileType? LinkedProfileType,
    IEnumerable<int> PermissionIds
);

public record UpdateUserRequest(
    string Name,
    string? Phone,
    string? Avatar,
    UserRole Role,
    IEnumerable<int> PermissionIds
);

public record UpdateUserStatusRequest(UserStatus Status);

public record UserStatsDto(
    int Total,
    int Active,
    Dictionary<string, int> ByRole
);
