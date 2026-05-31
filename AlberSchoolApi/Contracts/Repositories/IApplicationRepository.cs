using Entities.Models.Admissions;

namespace Contracts.Repositories;

public interface IApplicationRepository : IRepositoryBase<Application>
{
    Task<IEnumerable<Application>> GetPendingAsync(bool trackChanges);
}
