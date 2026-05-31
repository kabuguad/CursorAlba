using Entities.Models.Shared;

namespace Entities.Models.Content;

public class GalleryImage : BaseEntity
{
    public string Url { get; set; } = string.Empty;
    public string? Caption { get; set; }
    public string? Category { get; set; }
    public int SortOrder { get; set; }
    public bool IsPublic { get; set; } = true;
}