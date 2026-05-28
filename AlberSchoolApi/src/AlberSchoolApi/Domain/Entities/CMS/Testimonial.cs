using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.CMS;

public class Testimonial : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    /// <summary>e.g. "Parent, 2024" or "Alumni, Class of 2020"</summary>
    public string? Role { get; set; }
    public string Quote { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public bool IsPublished { get; set; } = true;
    public int SortOrder { get; set; } = 0;
}

public class VirtualTourSpot : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    /// <summary>Equirectangular panorama image URL for 360° viewer.</summary>
    public string? PanoramaUrl { get; set; }
    public string? Description { get; set; }
    public int SortOrder { get; set; } = 0;
    public bool IsPublished { get; set; } = true;
}
