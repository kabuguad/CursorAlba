using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Application.DTOs.Auth;

public record LoginRequest(string Email, string Password);

public record LoginResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    UserDto User
);

public record RefreshTokenRequest(string RefreshToken);

public record ForgotPasswordRequest(string Email);

public record ResetPasswordRequest(string Token, string NewPassword, string ConfirmPassword);

public record ChangePasswordRequest(string CurrentPassword, string NewPassword, string ConfirmPassword);

public record UserDto(
    int Id,
    string Name,
    string Email,
    string? Phone,
    string? Avatar,
    UserRole Role,
    UserStatus Status,
    DateTime? LastLoginAt,
    IEnumerable<string> Permissions
);
