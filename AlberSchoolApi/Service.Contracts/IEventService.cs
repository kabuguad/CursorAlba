using Entities.Models.Content;

namespace Service.Contracts;

public interface IEventService
{
    Task<IEnumerable<Event>> GetUpcomingAsync(bool trackChanges);
    Task<IEnumerable<Event>> GetAllAsync(bool trackChanges);
    Task<Event> CreateAsync(Event ev);
    Task UpdateAsync(int id, Event ev);
    Task DeleteAsync(int id);
}
