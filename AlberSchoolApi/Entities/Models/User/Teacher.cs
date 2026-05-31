using Entities.Models.Shared;

namespace Entities.Models.User;

public class Teacher : BaseEntity
{
    public int UserId { get; set; }
    public ApplicationUser? User { get; set; }

    public string? Qualification { get; set; }
    public string? Specialization { get; set; }
    public DateTime? HireDate { get; set; }
}
