using Entities.Models.Shared;

namespace Entities.Models.Content;

public class Event : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string? Location { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsPublished { get; set; }
    public string? EventType { get; set; }
}