using AlberSchoolApi.Domain.Entities.Common;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.Academic;

public class Term : BaseEntity
{
    public int AcademicYearId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public bool IsCurrent { get; set; } = false;
    public TermStatus Status { get; set; } = TermStatus.Upcoming;

    public AcademicYear AcademicYear { get; set; } = null!;
    public ICollection<Exam> Exams { get; set; } = [];
    public ICollection<Finance.FeeStructure> FeeStructures { get; set; } = [];
    public ICollection<Finance.Invoice> Invoices { get; set; } = [];
    public ICollection<Finance.Payment> Payments { get; set; } = [];
}
