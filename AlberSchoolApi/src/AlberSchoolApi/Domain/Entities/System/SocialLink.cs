using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.System;

public class SocialLink : BaseEntity
{
    /// <summary>e.g. "facebook", "instagram", "x", "youtube", "tiktok", "linkedin"</summary>
    public string Platform { get; set; } = string.Empty;
    public string? Url { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;
}
