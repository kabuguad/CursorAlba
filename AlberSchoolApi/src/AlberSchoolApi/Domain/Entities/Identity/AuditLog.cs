using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.Identity;

public class AuditLog
{
    public long Id { get; set; }
    public int? UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? UserRole { get; set; }
    public AuditAction Action { get; set; }
    public string Resource { get; set; } = string.Empty;
    public string? ResourceId { get; set; }
    public string? Details { get; set; }
    public string? IpAddress { get; set; }
    public string? SessionId { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
}
