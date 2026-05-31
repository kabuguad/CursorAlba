using Entities.Models.Academics;

namespace Contracts.Repositories;

public interface ITimetableRepository : IRepositoryBase<TimetableEntry>
{
    Task<IEnumerable<TimetableEntry>> GetByClassAsync(int classId, bool trackChanges);
    Task<IEnumerable<TimetableEntry>> GetByTeacherAsync(int teacherId, bool trackChanges);
}
