using AlberSchoolApi.Domain.Entities.Common;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.Identity;

public class User : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public UserRole Role { get; set; }
    public UserStatus Status { get; set; } = UserStatus.Active;

    /// <summary>
    /// Points to either Students.Id or StaffMembers.Id depending on LinkedProfileType.
    /// No FK enforced at DB level — enforced in application layer.
    /// </summary>
    public int? LinkedProfileId { get; set; }
    public LinkedProfileType? LinkedProfileType { get; set; }

    public DateTime? LastLoginAt { get; set; }
    public string? PasswordResetToken { get; set; }
    public DateTime? PasswordResetExpiresAt { get; set; }
    public DateTime? EmailVerifiedAt { get; set; }

    // Navigation
    public ICollection<UserPermission> UserPermissions { get; set; } = [];
    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
    public ICollection<AuditLog> AuditLogs { get; set; } = [];
}
