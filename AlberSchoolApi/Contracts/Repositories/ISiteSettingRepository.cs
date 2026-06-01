using Entities.Models.Content;

namespace Contracts.Repositories;

public interface ISiteSettingRepository : IRepositoryBase<SiteSetting>
{
    Task<SiteSetting?> GetByKeyAsync(string key, bool trackChanges);
    Task<IEnumerable<SiteSetting>> GetAllAsync(bool trackChanges);
}
