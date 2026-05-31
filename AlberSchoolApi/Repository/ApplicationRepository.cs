using Microsoft.EntityFrameworkCore;
using Contracts.Repositories;
using Repository;
using Entities.Models.Admissions;

namespace Repository;

public class ApplicationRepository : RepositoryBase<Application>, IApplicationRepository
{
    public ApplicationRepository(RepositoryContext context) : base(context) { }

    public async Task<IEnumerable<Application>> GetPendingAsync(bool trackChanges) =>
        await FindByCondition(a => a.Status == "Pending", trackChanges)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
}
