using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Domain.Entities.Library;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Application.Interfaces.Repositories;

public interface IBookRepository : IBaseRepository<Book>
{
    Task<Book?> GetByIsbnAsync(string isbn, CancellationToken ct = default);
    Task<PagedResult<Book>> SearchAsync(string? search, string? category, int page, int pageSize, CancellationToken ct = default);
    Task<bool> IsAvailableAsync(int bookId, CancellationToken ct = default);
    Task AdjustAvailabilityAsync(int bookId, int delta, CancellationToken ct = default);
}

public interface IBorrowingRepository : IBaseRepository<Borrowing>
{
    Task<IEnumerable<Borrowing>> GetByBorrowerAsync(int userId, CancellationToken ct = default);
    Task<IEnumerable<Borrowing>> GetOverdueAsync(CancellationToken ct = default);
    Task<Borrowing?> GetActiveByBookAndBorrowerAsync(int bookId, int userId, CancellationToken ct = default);
    Task<PagedResult<Borrowing>> SearchAsync(string? search, BorrowingStatus? status, int page, int pageSize, CancellationToken ct = default);
}
