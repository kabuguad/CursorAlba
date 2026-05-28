using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.CMS;

public class ContentPage : BaseEntity
{
    /// <summary>URL-safe identifier, e.g. "about", "facilities", "admissions".</summary>
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? MetaDescription { get; set; }
    public string? HeroImageUrl { get; set; }
    public string? HeroTitle { get; set; }
    public string? HeroSubtitle { get; set; }
    public string? Body { get; set; }
    public bool IsPublished { get; set; } = true;
    public int? LastEditedBy { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Identity.User? Editor { get; set; }
    public ICollection<ContentSection> Sections { get; set; } = [];
}

public class ContentSection : BaseEntity
{
    public int PageId { get; set; }
    /// <summary>e.g. "mission", "values", "stats", "cta"</summary>
    public string? SectionKey { get; set; }
    public string? Title { get; set; }
    public string? Body { get; set; }
    public string? ImageUrl { get; set; }
    public int SortOrder { get; set; } = 0;
    /// <summary>Flexible JSON for extra fields: icon, color, link, etc.</summary>
    public string? Metadata { get; set; }

    public ContentPage Page { get; set; } = null!;
}
