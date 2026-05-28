using System.Linq.Expressions;
using AlberSchoolApi.Application.Common;

namespace AlberSchoolApi.Application.Interfaces.Repositories;

/// <summary>
/// Generic repository contract — covers standard CRUD operations.
/// Domain-specific repositories extend this with query methods relevant to their aggregate.
/// </summary>
public interface IBaseRepository<TEntity> where TEntity : class
{
    // ── Queries ──────────────────────────────────────────────────────────
    Task<TEntity?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<TEntity>> GetAllAsync(CancellationToken ct = default);
    Task<PagedResult<TEntity>> GetPagedAsync(PagedRequest request, CancellationToken ct = default);
    Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken ct = default);
    Task<TEntity?> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken ct = default);
    Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken ct = default);
    Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null, CancellationToken ct = default);

    // ── Mutations ─────────────────────────────────────────────────────────
    Task<TEntity> AddAsync(TEntity entity, CancellationToken ct = default);
    Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken ct = default);
    Task UpdateAsync(TEntity entity, CancellationToken ct = default);
    Task DeleteAsync(TEntity entity, CancellationToken ct = default);
    Task DeleteRangeAsync(IEnumerable<TEntity> entities, CancellationToken ct = default);

    // ── Unit of Work ──────────────────────────────────────────────────────
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
