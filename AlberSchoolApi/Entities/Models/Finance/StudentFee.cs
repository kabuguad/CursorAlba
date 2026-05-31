using Entities.Models.Shared;

namespace Entities.Models.Finance;

public class StudentFee : BaseEntity
{
    public int StudentId { get; set; }
    public User.Student? Student { get; set; }

    public int FeeStructureId { get; set; }
    public FeeStructure? FeeStructure { get; set; }

    public decimal AmountDue { get; set; }
    public decimal AmountPaid { get; set; }
    public decimal Balance => AmountDue - AmountPaid;

    public PaymentStatus Status { get; set; }
    public DateTime? PaidAt { get; set; }
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}

public enum PaymentStatus
{
    Pending,
    Partial,
    Paid,
    Overdue
}
