using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Infrastructure.Data;

namespace AlberSchoolApi.Infrastructure.Repositories;

/// <summary>
/// Concrete generic repository used when no domain-specific repository interface exists.
/// Registered via open-generic DI:  IBaseRepository&lt;T&gt; → GenericRepository&lt;T&gt;.
/// </summary>
public class GenericRepository<TEntity> : BaseRepository<TEntity>
    where TEntity : class
{
    public GenericRepository(AppDbContext db) : base(db) { }
}
