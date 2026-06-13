namespace DTOs.Finance;

public class FeeStructureDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? Term { get; set; }
    public string? AcademicYear { get; set; }
    public int ClassId { get; set; }
    public string ClassName { get; set; } = string.Empty;
    public string? FeeType { get; set; }
    public DateTime DueDate { get; set; }
    public string Status { get; set; } = string.Empty;
}