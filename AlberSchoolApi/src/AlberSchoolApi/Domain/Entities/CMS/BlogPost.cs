using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.CMS;

public class BlogPost : AuditableEntity
{
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public string? Body { get; set; }
    public string? FeaturedImageUrl { get; set; }
    public int? AuthorId { get; set; }
    public string? Category { get; set; }
    public string? Tags { get; set; }
    public bool IsPublished { get; set; } = false;
    public DateTime? PublishedAt { get; set; }
    public int ViewCount { get; set; } = 0;

    public Identity.User? Author { get; set; }
}
