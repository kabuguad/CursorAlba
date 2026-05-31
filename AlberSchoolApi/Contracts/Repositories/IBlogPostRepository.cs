using Entities.Models.Content;

namespace Contracts.Repositories;

public interface IBlogPostRepository : IRepositoryBase<BlogPost>
{
    Task<BlogPost?> GetBySlugAsync(string slug, bool trackChanges);
    Task<IEnumerable<BlogPost>> GetPublishedAsync(bool trackChanges);
}
