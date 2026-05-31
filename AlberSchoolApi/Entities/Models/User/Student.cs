using Entities.Models.Shared;
using Entities.Models.Academics;

namespace Entities.Models.User;

public class Student : BaseEntity
{
    public int UserId { get; set; }
    public ApplicationUser? User { get; set; }

    public int ClassId { get; set; }
    public Entities.Models.Academics.Class? Class { get; set; }

    public int? ParentId { get; set; }
    public Parent? Parent { get; set; }

    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? Address { get; set; }
}
