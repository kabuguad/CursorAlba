using Contracts.Repositories;
using Entities.Models.Content;
using Microsoft.EntityFrameworkCore;

namespace Repository;

public class SiteSettingRepository : RepositoryBase<SiteSetting>, ISiteSettingRepository
{
    public SiteSettingRepository(RepositoryContext context) : base(context) { }

    public async Task<SiteSetting?> GetByKeyAsync(string key, bool trackChanges) =>
        await FindByCondition(s => s.Key == key, trackChanges).FirstOrDefaultAsync();

    public async Task<IEnumerable<SiteSetting>> GetAllAsync(bool trackChanges) =>
        await FindAll(trackChanges).OrderBy(s => s.Key).ToListAsync();
}
