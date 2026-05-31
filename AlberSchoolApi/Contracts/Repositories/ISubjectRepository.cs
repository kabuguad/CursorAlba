using Entities.Models.Academics;

namespace Contracts.Repositories;

public interface ISubjectRepository : IRepositoryBase<Subject>
{
    Task<IEnumerable<Subject>> GetByClassAsync(int classId, bool trackChanges);
}
