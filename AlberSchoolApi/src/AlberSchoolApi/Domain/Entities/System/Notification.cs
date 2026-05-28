namespace AlberSchoolApi.Domain.Entities.System;

public class Notification
{
    public long Id { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Body { get; set; }
    /// <summary>announcement | message | payment | grade | leave</summary>
    public string? Type { get; set; }
    public string? ResourceType { get; set; }
    public string? ResourceId { get; set; }
    public bool IsRead { get; set; } = false;
    public DateTime? ReadAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Identity.User User { get; set; } = null!;
}
