using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.Finance;

public class InvoiceLineItem : BaseEntity
{
    public int InvoiceId { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int SortOrder { get; set; } = 0;

    public Invoice Invoice { get; set; } = null!;
}
