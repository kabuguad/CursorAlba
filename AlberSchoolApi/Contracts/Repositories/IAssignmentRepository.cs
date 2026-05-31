using Entities.Models.Academics;

namespace Contracts.Repositories;

public interface IAssignmentRepository : IRepositoryBase<Assignment>
{
    Task<IEnumerable<Assignment>> GetByClassAsync(int classId, bool trackChanges);
    Task<IEnumerable<Assignment>> GetByTeacherAsync(int teacherId, bool trackChanges);
}
