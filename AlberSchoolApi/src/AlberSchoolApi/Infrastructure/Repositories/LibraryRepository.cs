using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.Library;
using AlberSchoolApi.Domain.Enums;
using AlberSchoolApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AlberSchoolApi.Infrastructure.Repositories;

public class BookRepository : BaseRepository<Book>, IBookRepository
{
    public BookRepository(AppDbContext db) : base(db) { }

    public async Task<Book?> GetByIsbnAsync(string isbn, CancellationToken ct = default)
        => await _set.FirstOrDefaultAsync(b => b.Isbn == isbn, ct);

    public async Task<PagedResult<Book>> SearchAsync(string? search, string? category, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            q = q.Where(b => b.Title.Contains(search) || (b.Author != null && b.Author.Contains(search)) || (b.Isbn != null && b.Isbn.Contains(search)));
        if (!string.IsNullOrWhiteSpace(category))
            q = q.Where(b => b.Category == category);
        var total = await q.CountAsync(ct);
        var items = await q.OrderBy(b => b.Title).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return new PagedResult<Book> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
    }

    public async Task<bool> IsAvailableAsync(int bookId, CancellationToken ct = default)
        => await _set.AnyAsync(b => b.Id == bookId && b.AvailableCopies > 0, ct);

    public async Task AdjustAvailabilityAsync(int bookId, int delta, CancellationToken ct = default)
    {
        await _set.Where(b => b.Id == bookId)
            .ExecuteUpdateAsync(s => s.SetProperty(b => b.AvailableCopies, b => b.AvailableCopies + delta), ct);
    }
}

public class BorrowingRepository : BaseRepository<Borrowing>, IBorrowingRepository
{
    public BorrowingRepository(AppDbContext db) : base(db) { }

    public async Task<IEnumerable<Borrowing>> GetByBorrowerAsync(int userId, CancellationToken ct = default)
        => await _set.AsNoTracking().Include(b => b.Book)
            .Where(b => b.BorrowerId == userId)
            .OrderByDescending(b => b.IssuedDate).ToListAsync(ct);

    public async Task<IEnumerable<Borrowing>> GetOverdueAsync(CancellationToken ct = default)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        return await _set.AsNoTracking().Include(b => b.Book)
            .Where(b => b.Status == BorrowingStatus.Active && b.DueDate < today)
            .ToListAsync(ct);
    }

    public async Task<Borrowing?> GetActiveByBookAndBorrowerAsync(int bookId, int userId, CancellationToken ct = default)
        => await _set.FirstOrDefaultAsync(b => b.BookId == bookId && b.BorrowerId == userId && b.Status == BorrowingStatus.Active, ct);

    public async Task<PagedResult<Borrowing>> SearchAsync(string? search, BorrowingStatus? status, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking().Include(b => b.Book).AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            q = q.Where(b => b.Book.Title.Contains(search));
        if (status.HasValue)
            q = q.Where(b => b.Status == status.Value);
        var total = await q.CountAsync(ct);
        var items = await q.OrderByDescending(b => b.IssuedDate).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return new PagedResult<Borrowing> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
    }
}
