using Entities.Models.Shared;

namespace Entities.Models.User;

public class Parent : BaseEntity
{
    public int UserId { get; set; }
    public ApplicationUser? User { get; set; }

    public string? Occupation { get; set; }
    public string? PhoneNumber2 { get; set; }
    public string? Address { get; set; }
}
