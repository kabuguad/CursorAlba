using Entities.Models.Shared;

namespace Entities.Models.Content;

public class PublicFeeRow : BaseEntity
{
    public string Level { get; set; } = string.Empty;
    public decimal Tuition { get; set; }
    public decimal Transport { get; set; }
    public decimal Activities { get; set; }
    public int SortOrder { get; set; }
}
