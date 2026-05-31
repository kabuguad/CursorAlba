using Entities.Models.Academics;
using Entities.Models.Shared;
using Entities.Models.User;

namespace Entities.Models.Grade;

public class Grade : BaseEntity, ISoftDelete
{
    public int StudentId { get; set; }
    public Student? Student { get; set; }

    public int SubjectId { get; set; }
    public Subject? Subject { get; set; }

    public decimal Score { get; set; }
    public decimal MaxScore { get; set; }
    public string? AssessmentType { get; set; }
    public DateTime AssessmentDate { get; set; }
    public string? Remarks { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
}