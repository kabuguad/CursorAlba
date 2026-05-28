using AlberSchoolApi.Domain.Entities.Common;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.Finance;

public class ExpenseCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ICollection<Expense> Expenses { get; set; } = [];
}

public class Expense : BaseEntity
{
    public int? CategoryId { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? Payee { get; set; }
    public string? ReceiptNo { get; set; }
    public DateOnly ExpenseDate { get; set; }
    public ExpenseStatus Status { get; set; } = ExpenseStatus.Pending;
    public int? ApprovedBy { get; set; }
    public int? SubmittedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ExpenseCategory? Category { get; set; }
    public Identity.User? ApprovedByUser { get; set; }
    public Identity.User? SubmittedByUser { get; set; }
}
