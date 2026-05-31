using Entities.Models.Shared;

namespace Entities.Models.Finance;

public class FeeStructure : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? Term { get; set; }
    public string? AcademicYear { get; set; }
    public int ClassId { get; set; }
    public Academics.Class? Class { get; set; }
    public string? FeeType { get; set; }
    public DateTime DueDate { get; set; }
    public decimal AmountPaid { get; set; }
    public string Status { get; set; } = "Pending";
    public ICollection<StudentFee> AssignedFees { get; set; } = new List<StudentFee>();
}
