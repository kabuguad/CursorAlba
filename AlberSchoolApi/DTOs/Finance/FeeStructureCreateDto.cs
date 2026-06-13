namespace DTOs.Finance;

public class FeeStructureCreateDto
{
    public string Name { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? Term { get; set; }
    public string? AcademicYear { get; set; }
    public int ClassId { get; set; }
    public string? FeeType { get; set; }
    public DateTime DueDate { get; set; }
}

public class FeeStructureUpdateDto : FeeStructureCreateDto
{
}