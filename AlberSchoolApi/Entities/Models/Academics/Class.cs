using Entities.Models.Shared;
using Entities.Models.User;

namespace Entities.Models.Academics;

public class Class : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Section { get; set; }
    public string? Description { get; set; }
    public ICollection<Student> Students { get; set; } = new List<Student>();
    public ICollection<Subject> Subjects { get; set; } = new List<Subject>();
}
