namespace DTOs.Finance;

public class PaymentCreateDto
{
    public int StudentFeeId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string? TransactionReference { get; set; }
    public string? Provider { get; set; }
    public string? Notes { get; set; }
}
