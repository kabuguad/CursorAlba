using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.Academic;

public class Homework : BaseEntity
{
    public int ClassId { get; set; }
    public int SubjectId { get; set; }
    public int TeacherId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateOnly DueDate { get; set; }
    public string? AttachmentUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public SchoolClass Class { get; set; } = null!;
    public Subject Subject { get; set; } = null!;
    public People.StaffMember Teacher { get; set; } = null!;
}
