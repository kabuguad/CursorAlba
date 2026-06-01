using Entities.Models.Shared;

namespace Entities.Models.Content;

public class ProgramLevel : BaseEntity
{
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Ages { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public int SortOrder { get; set; }
}
