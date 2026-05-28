using AlberSchoolApi.Domain.Entities.Common;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.Finance;

public class Invoice : AuditableEntity
{
    public string InvoiceNo { get; set; } = string.Empty;
    public int StudentId { get; set; }
    public int TermId { get; set; }
    public DateOnly IssuedDate { get; set; }
    public DateOnly DueDate { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal PaidAmount { get; set; } = 0;
    public decimal DiscountAmount { get; set; } = 0;
    public string? DiscountReason { get; set; }
    public InvoiceStatus Status { get; set; } = InvoiceStatus.Unpaid;

    /// <summary>Computed: TotalAmount - PaidAmount - DiscountAmount.</summary>
    public decimal Balance => TotalAmount - PaidAmount - DiscountAmount;

    public People.Student Student { get; set; } = null!;
    public Academic.Term Term { get; set; } = null!;
    public ICollection<InvoiceLineItem> LineItems { get; set; } = [];
    public ICollection<Payment> Payments { get; set; } = [];
}
