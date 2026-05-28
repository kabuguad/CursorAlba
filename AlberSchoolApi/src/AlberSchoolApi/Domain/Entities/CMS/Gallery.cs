using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.CMS;

public class GalleryAlbum : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? Category { get; set; }
    public bool IsPublished { get; set; } = true;
    public int SortOrder { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<GalleryImage> Images { get; set; } = [];
}

public class GalleryImage : BaseEntity
{
    public int AlbumId { get; set; }
    public string Url { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? Caption { get; set; }
    public int SortOrder { get; set; } = 0;
    public int? UploadedBy { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    public GalleryAlbum Album { get; set; } = null!;
    public Identity.User? Uploader { get; set; }
}
