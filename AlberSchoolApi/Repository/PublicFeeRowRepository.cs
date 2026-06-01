using Contracts.Repositories;
using Entities.Models.Content;
using Microsoft.EntityFrameworkCore;

namespace Repository;

public class PublicFeeRowRepository : RepositoryBase<PublicFeeRow>, IPublicFeeRowRepository
{
    public PublicFeeRowRepository(RepositoryContext context) : base(context) { }

    public async Task<IEnumerable<PublicFeeRow>> GetAllOrderedAsync(bool trackChanges) =>
        await FindAll(trackChanges).OrderBy(f => f.SortOrder).ToListAsync();
}
