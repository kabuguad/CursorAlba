namespace AlberSchoolApi.Domain.Entities.Identity;

/// <summary>Junction table — extra permissions granted to a specific user.</summary>
public class UserPermission
{
    public int UserId { get; set; }
    public int PermissionId { get; set; }
    public DateTime GrantedAt { get; set; } = DateTime.UtcNow;
    public int? GrantedBy { get; set; }

    // Navigation
    public User User { get; set; } = null!;
    public Permission Permission { get; set; } = null!;
    public User? GrantedByUser { get; set; }
}
