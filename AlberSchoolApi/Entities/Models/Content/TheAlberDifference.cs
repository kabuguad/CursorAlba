using Entities.Models.Shared;

namespace Entities.Models.Content;

public class TheAlberDifference : BaseEntity
{
    public string Icon { get; set; } = string.Empty;
    public string BadgeName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}