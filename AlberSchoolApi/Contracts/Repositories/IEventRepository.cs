using Entities.Models.Content;

namespace Contracts.Repositories;

public interface IEventRepository : IRepositoryBase<Event>
{
    Task<IEnumerable<Event>> GetUpcomingAsync(bool trackChanges);
}
