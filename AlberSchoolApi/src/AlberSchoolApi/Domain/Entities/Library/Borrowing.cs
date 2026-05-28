using AlberSchoolApi.Domain.Entities.Common;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.Library;

public class Borrowing : BaseEntity
{
    public int BookId { get; set; }
    public int BorrowerId { get; set; }
    public BorrowerType BorrowerType { get; set; }
    public DateOnly IssuedDate { get; set; }
    public DateOnly DueDate { get; set; }
    public DateOnly? ReturnedDate { get; set; }
    public BorrowingStatus Status { get; set; } = BorrowingStatus.Active;
    public int? IssuedBy { get; set; }
    public decimal FineAmount { get; set; } = 0;

    public Book Book { get; set; } = null!;
    public Identity.User Borrower { get; set; } = null!;
    public Identity.User? IssuedByUser { get; set; }
}
