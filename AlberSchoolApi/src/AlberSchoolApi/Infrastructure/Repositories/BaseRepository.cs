using System.Linq.Expressions;
using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AlberSchoolApi.Infrastructure.Repositories;

/// <summary>
/// Generic repository implementation backed by EF Core.
/// All domain-specific repositories inherit from this and override / extend as needed.
/// </summary>
public class BaseRepository<TEntity> : IBaseRepository<TEntity> where TEntity : class
{
    protected readonly AppDbContext _db;
    protected readonly DbSet<TEntity> _set;

    public BaseRepository(AppDbContext db)
    {
        _db = db;
        _set = db.Set<TEntity>();
    }

    // ── Queries ──────────────────────────────────────────────────────────

    public virtual async Task<TEntity?> GetByIdAsync(int id, CancellationToken ct = default)
        => await _set.FindAsync([id], ct);

    public virtual async Task<IEnumerable<TEntity>> GetAllAsync(CancellationToken ct = default)
        => await _set.AsNoTracking().ToListAsync(ct);

    public virtual async Task<PagedResult<TEntity>> GetPagedAsync(PagedRequest request, CancellationToken ct = default)
    {
        var query = _set.AsNoTracking();
        var total = await query.CountAsync(ct);
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(ct);

        return new PagedResult<TEntity>
        {
            Items = items,
            TotalCount = total,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }

    public virtual async Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken ct = default)
        => await _set.AsNoTracking().Where(predicate).ToListAsync(ct);

    public virtual async Task<TEntity?> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken ct = default)
        => await _set.AsNoTracking().FirstOrDefaultAsync(predicate, ct);

    public virtual async Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken ct = default)
        => await _set.AnyAsync(predicate, ct);

    public virtual async Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null, CancellationToken ct = default)
        => predicate is null
            ? await _set.CountAsync(ct)
            : await _set.CountAsync(predicate, ct);

    // ── Mutations ─────────────────────────────────────────────────────────

    public virtual async Task<TEntity> AddAsync(TEntity entity, CancellationToken ct = default)
    {
        await _set.AddAsync(entity, ct);
        return entity;
    }

    public virtual async Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken ct = default)
        => await _set.AddRangeAsync(entities, ct);

    public virtual Task UpdateAsync(TEntity entity, CancellationToken ct = default)
    {
        _set.Update(entity);
        return Task.CompletedTask;
    }

    public virtual Task DeleteAsync(TEntity entity, CancellationToken ct = default)
    {
        _set.Remove(entity);
        return Task.CompletedTask;
    }

    public virtual Task DeleteRangeAsync(IEnumerable<TEntity> entities, CancellationToken ct = default)
    {
        _set.RemoveRange(entities);
        return Task.CompletedTask;
    }

    // ── Unit of Work ──────────────────────────────────────────────────────

    public virtual async Task<int> SaveChangesAsync(CancellationToken ct = default)
        => await _db.SaveChangesAsync(ct);
}
