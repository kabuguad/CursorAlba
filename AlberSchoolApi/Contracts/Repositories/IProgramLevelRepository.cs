using Entities.Models.Content;

namespace Contracts.Repositories;

public interface IProgramLevelRepository : IRepositoryBase<ProgramLevel>
{
    Task<IEnumerable<ProgramLevel>> GetAllOrderedAsync(bool trackChanges);
}
