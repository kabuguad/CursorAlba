namespace DTOs.Content;

public class TheAlberDifferenceDto
{
    public int Id { get; set; }
    public string Icon { get; set; } = string.Empty;
    public string BadgeName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
}