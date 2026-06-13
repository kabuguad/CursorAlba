namespace DTOs.Content;

public class PublicFeeRowDto
{
    public int Id { get; set; }
    public string Level { get; set; } = string.Empty;
    public decimal Tuition { get; set; }
    public decimal Transport { get; set; }
    public decimal Activities { get; set; }
    public int SortOrder { get; set; }
    public decimal Total => Tuition + Transport + Activities;
}