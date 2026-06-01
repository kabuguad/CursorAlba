using Entities.Models.Shared;

namespace Entities.Models.Content;

public class SiteSetting : BaseEntity
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}
