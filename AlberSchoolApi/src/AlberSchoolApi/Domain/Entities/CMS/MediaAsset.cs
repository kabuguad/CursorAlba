using AlberSchoolApi.Domain.Entities.Common;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.CMS;

public class MediaAsset : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public MediaType Type { get; set; }
    public long? SizeBytes { get; set; }
    public string? MimeType { get; set; }
    public string? Category { get; set; }
    public int? UploadedBy { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    public Identity.User? Uploader { get; set; }
}
