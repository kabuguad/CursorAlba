using Entities.Models.Shared;

namespace Entities.Models.Academics;

public class Assignment : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime DueDate { get; set; }
    public int ClassId { get; set; }
    public Class? Class { get; set; }
    public int SubjectId { get; set; }
    public Subject? Subject { get; set; }
    public int? TeacherId { get; set; }
    public User.Teacher? Teacher { get; set; }
}
