using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.Library;

public class Book : BaseEntity
{
    public string? Isbn { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Author { get; set; }
    public string? Publisher { get; set; }
    public int? PublishedYear { get; set; }
    public string? Category { get; set; }
    public string? CoverUrl { get; set; }
    public int TotalCopies { get; set; } = 1;
    public int AvailableCopies { get; set; } = 1;
    public string? Location { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Borrowing> Borrowings { get; set; } = [];
}
