using Microsoft.EntityFrameworkCore;
using Contracts.Repositories;
using Repository;
using Entities.Models.Content;

namespace Repository;

public class GalleryImageRepository : RepositoryBase<GalleryImage>, IGalleryImageRepository
{
    public GalleryImageRepository(RepositoryContext context) : base(context) { }

    public async Task<IEnumerable<GalleryImage>> GetPublicAsync(bool trackChanges) =>
        await FindByCondition(g => g.IsPublic, trackChanges)
            .OrderBy(g => g.SortOrder)
            .ToListAsync();
}
