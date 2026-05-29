using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.DTOs.CMS;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.Library;
using AlberSchoolApi.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlberSchoolApi.Presentation.Controllers;

[ApiController]
[Route("api/library")]
[Authorize]
public class LibraryController : ControllerBase
{
    private readonly IBookRepository _books;
    private readonly IBorrowingRepository _borrowings;

    public LibraryController(IBookRepository books, IBorrowingRepository borrowings)
    {
        _books = books;
        _borrowings = borrowings;
    }

    // ── Books ─────────────────────────────────────────────────────────────

    [HttpGet("books")]
    public async Task<ActionResult<ApiResponse<PagedResult<object>>>> GetBooks(
        [FromQuery] string? search, [FromQuery] string? category,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _books.SearchAsync(search, category, page, pageSize, ct);
        var dtos = result.Items.Select(b => new
        {
            b.Id, b.Isbn, b.Title, b.Author, b.Publisher, b.PublishedYear,
            b.Category, b.CoverUrl, b.TotalCopies, b.AvailableCopies, b.Location, b.AddedAt
        });
        return Ok(ApiResponse<PagedResult<object>>.Ok(new PagedResult<object>
        {
            Items = dtos.Cast<object>(), TotalCount = result.TotalCount, Page = result.Page, PageSize = result.PageSize
        }));
    }

    [HttpGet("books/{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> GetBook(int id, CancellationToken ct)
    {
        var book = await _books.GetByIdAsync(id, ct);
        if (book is null) return NotFound(ApiResponse<object>.Fail("Book not found."));
        return Ok(ApiResponse<object>.Ok(new { book.Id, book.Isbn, book.Title, book.Author, book.Publisher, book.PublishedYear, book.Category, book.CoverUrl, book.TotalCopies, book.AvailableCopies, book.Location, book.AddedAt }));
    }

    [HttpPost("books")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<object>>> CreateBook([FromBody] CreateBookRequest req, CancellationToken ct)
    {
        if (!string.IsNullOrWhiteSpace(req.Isbn) && await _books.ExistsAsync(b => b.Isbn == req.Isbn, ct))
            return Conflict(ApiResponse<object>.Fail("A book with this ISBN already exists."));

        var book = new Book { Isbn = req.Isbn, Title = req.Title, Author = req.Author, Publisher = req.Publisher, PublishedYear = req.PublishedYear, Category = req.Category, CoverUrl = req.CoverUrl, TotalCopies = req.TotalCopies, AvailableCopies = req.TotalCopies, Location = req.Location };
        await _books.AddAsync(book, ct);
        await _books.SaveChangesAsync(ct);
        return Ok(ApiResponse<object>.Ok(new { book.Id, book.Title, book.TotalCopies, book.AvailableCopies }, "Book added."));
    }

    // ── Borrowings ────────────────────────────────────────────────────────

    [HttpGet("borrowings")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<PagedResult<object>>>> GetBorrowings(
        [FromQuery] string? search, [FromQuery] BorrowingStatus? status,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _borrowings.SearchAsync(search, status, page, pageSize, ct);
        var dtos = result.Items.Select(b => new { b.Id, b.BookId, b.Book?.Title, b.BorrowerId, b.BorrowerType, b.IssuedDate, b.DueDate, b.ReturnedDate, b.Status, b.FineAmount });
        return Ok(ApiResponse<PagedResult<object>>.Ok(new PagedResult<object>
        {
            Items = dtos.Cast<object>(), TotalCount = result.TotalCount, Page = result.Page, PageSize = result.PageSize
        }));
    }

    [HttpGet("borrowings/overdue")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<IEnumerable<object>>>> GetOverdue(CancellationToken ct)
    {
        var items = await _borrowings.GetOverdueAsync(ct);
        return Ok(ApiResponse<IEnumerable<object>>.Ok(items.Select(b => (object)new { b.Id, b.BookId, b.Book?.Title, b.BorrowerId, b.DueDate, b.FineAmount })));
    }

    [HttpPost("borrowings/issue")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<object>>> IssueBook([FromBody] IssueBorrowingRequest req, CancellationToken ct)
    {
        if (!await _books.IsAvailableAsync(req.BookId, ct))
            return Conflict(ApiResponse<object>.Fail("No available copies of this book."));

        var userIdStr = User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        int.TryParse(userIdStr, out var issuedBy);

        var borrowing = new Borrowing { BookId = req.BookId, BorrowerId = req.BorrowerId, BorrowerType = req.BorrowerType, IssuedDate = req.IssuedDate, DueDate = req.DueDate, IssuedBy = issuedBy };
        await _borrowings.AddAsync(borrowing, ct);
        await _books.AdjustAvailabilityAsync(req.BookId, -1, ct);
        await _borrowings.SaveChangesAsync(ct);
        return Ok(ApiResponse<object>.Ok(new { borrowing.Id, borrowing.BookId, borrowing.BorrowerId, borrowing.DueDate, borrowing.Status }, "Book issued."));
    }

    [HttpPatch("borrowings/{id:int}/return")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<object>>> ReturnBook(int id, CancellationToken ct)
    {
        var borrowing = await _borrowings.GetByIdAsync(id, ct);
        if (borrowing is null) return NotFound(ApiResponse<object>.Fail("Borrowing record not found."));
        if (borrowing.Status == BorrowingStatus.Returned)
            return BadRequest(ApiResponse<object>.Fail("Book already returned."));

        var returnedDate = DateOnly.FromDateTime(DateTime.UtcNow);
        borrowing.ReturnedDate = returnedDate;
        borrowing.Status = BorrowingStatus.Returned;
        if (returnedDate > borrowing.DueDate)
        {
            var daysOverdue = returnedDate.DayNumber - borrowing.DueDate.DayNumber;
            borrowing.FineAmount = daysOverdue * 5m; // KES 5 per day
        }
        await _borrowings.UpdateAsync(borrowing, ct);
        await _books.AdjustAvailabilityAsync(borrowing.BookId, 1, ct);
        await _borrowings.SaveChangesAsync(ct);
        return Ok(ApiResponse<object>.Ok(new { borrowing.Id, borrowing.Status, borrowing.FineAmount, ReturnedDate = borrowing.ReturnedDate }, "Book returned."));
    }

    // ── Request DTOs ──────────────────────────────────────────────────────

    public record CreateBookRequest(string? Isbn, string Title, string? Author, string? Publisher, int? PublishedYear, string? Category, string? CoverUrl, int TotalCopies = 1, string? Location = null);
    public record IssueBorrowingRequest(int BookId, int BorrowerId, BorrowerType BorrowerType, DateOnly IssuedDate, DateOnly DueDate);
}
