using Microsoft.EntityFrameworkCore;
using Contracts.Repositories;
using Repository;
using Entities.Models.Content;

namespace Repository;

public class EventRepository : RepositoryBase<Event>, IEventRepository
{
    public EventRepository(RepositoryContext context) : base(context) { }

    public async Task<IEnumerable<Event>> GetUpcomingAsync(bool trackChanges) =>
        await FindByCondition(e => e.StartDate >= DateTime.UtcNow, trackChanges)
            .OrderBy(e => e.StartDate)
            .ToListAsync();
}
