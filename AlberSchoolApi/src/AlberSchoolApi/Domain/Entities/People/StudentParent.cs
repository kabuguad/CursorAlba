using AlberSchoolApi.Domain.Entities.Identity;

namespace AlberSchoolApi.Domain.Entities.People;

/// <summary>Many-to-many: a student may have multiple parents; a parent may have multiple children.</summary>
public class StudentParent
{
    public int StudentId { get; set; }
    public int UserId { get; set; }
    public string? Relationship { get; set; }
    public bool IsGuardian { get; set; } = false;

    public Student Student { get; set; } = null!;
    public User User { get; set; } = null!;
}
