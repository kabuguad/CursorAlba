using Entities.Models.Shared;

namespace Entities.Models.Finance;

public class Payment : BaseEntity
{
    public int StudentFeeId { get; set; }
    public StudentFee? StudentFee { get; set; }

    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string? TransactionReference { get; set; }
    public string? Provider { get; set; }
    public DateTime PaidAt { get; set; }
    public string? Notes { get; set; }
}
