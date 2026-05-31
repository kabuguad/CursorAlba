using Entities.Models.Academics;

namespace Contracts.Repositories;

public interface IClassRepository : IRepositoryBase<Class>
{
    Task<IEnumerable<Class>> GetAllWithDetailsAsync(bool trackChanges);
}
