using Entities.Models.Grade;

namespace Contracts.Repositories;

public interface IGradeRepository : IRepositoryBase<Grade>
{
    Task<IEnumerable<Grade>> GetByStudentAsync(int studentId, bool trackChanges);
    Task<IEnumerable<Grade>> GetByClassAndSubjectAsync(int classId, int subjectId, bool trackChanges);
}
