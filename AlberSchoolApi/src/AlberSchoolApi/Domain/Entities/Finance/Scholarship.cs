using AlberSchoolApi.Domain.Entities.Common;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.Finance;

public class Scholarship : BaseEntity
{
    public int StudentId { get; set; }
    public ScholarshipType Type { get; set; }
    public decimal Value { get; set; }
    public string? Reason { get; set; }
    public int StartTermId { get; set; }
    public int? EndTermId { get; set; }
    public ScholarshipStatus Status { get; set; } = ScholarshipStatus.Active;
    public int? ApprovedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public People.Student Student { get; set; } = null!;
    public Academic.Term StartTerm { get; set; } = null!;
    public Academic.Term? EndTerm { get; set; }
    public Identity.User? ApprovedByUser { get; set; }
}
