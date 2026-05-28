using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.Communications;

public class Message : BaseEntity
{
    /// <summary>Groups replies into a conversation thread.</summary>
    public Guid ThreadId { get; set; }
    public int FromUserId { get; set; }
    public int ToUserId { get; set; }
    public string? Subject { get; set; }
    public string Body { get; set; } = string.Empty;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReadAt { get; set; }
    public bool IsDeletedBySender { get; set; } = false;
    public bool IsDeletedByRecipient { get; set; } = false;

    public Identity.User FromUser { get; set; } = null!;
    public Identity.User ToUser { get; set; } = null!;
}
