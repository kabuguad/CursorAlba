using Entities.Models.Shared;

namespace Entities.Models.Academics;

public class Subject : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string? Description { get; set; }
    public int ClassId { get; set; }
    public Class? Class { get; set; }
    public ICollection<TimetableEntry> TimetableEntries { get; set; } = new List<TimetableEntry>();
}
