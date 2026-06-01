using Entities.Models.Content;

namespace Contracts.Repositories;

public interface IPublicFeeRowRepository : IRepositoryBase<PublicFeeRow>
{
    Task<IEnumerable<PublicFeeRow>> GetAllOrderedAsync(bool trackChanges);
}
