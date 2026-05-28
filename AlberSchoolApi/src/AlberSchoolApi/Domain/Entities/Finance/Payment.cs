using AlberSchoolApi.Domain.Entities.Common;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.Finance;

public class Payment : BaseEntity
{
    public string Reference { get; set; } = string.Empty;
    public int StudentId { get; set; }
    public int? InvoiceId { get; set; }
    public int TermId { get; set; }
    public decimal Amount { get; set; }
    public PaymentMethod Method { get; set; }
    public string? Description { get; set; }
    public string? ParentName { get; set; }
    public string? Phone { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Completed;
    public int? RecordedBy { get; set; }
    public DateOnly PaymentDate { get; set; }
    public TimeOnly? PaymentTime { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public People.Student Student { get; set; } = null!;
    public Invoice? Invoice { get; set; }
    public Academic.Term Term { get; set; } = null!;
    public Identity.User? Recorder { get; set; }
}
