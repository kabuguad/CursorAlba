using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.Finance;

public class FeeStructure : BaseEntity
{
    public int TermId { get; set; }
    public string GradeLevel { get; set; } = string.Empty;
    public decimal Tuition { get; set; } = 0;
    public decimal Transport { get; set; } = 0;
    public decimal Activities { get; set; } = 0;
    public decimal Boarding { get; set; } = 0;
    public decimal Meals { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Academic.Term Term { get; set; } = null!;
}
