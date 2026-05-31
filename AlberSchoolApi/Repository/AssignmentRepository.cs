using Microsoft.EntityFrameworkCore;
using Contracts.Repositories;
using Entities.Models.Academics;

namespace Repository;

public class AssignmentRepository : RepositoryBase<Assignment>, IAssignmentRepository
{
    public AssignmentRepository(RepositoryContext context) : base(context) { }

    public async Task<IEnumerable<Assignment>> GetByClassAsync(int classId, bool trackChanges) =>
        await FindByCondition(a => a.ClassId == classId, trackChanges)
            .Include(a => a.Subject)
            .Include(a => a.Teacher).ThenInclude(t => t!.User)
            .OrderByDescending(a => a.DueDate)
            .ToListAsync();

    public async Task<IEnumerable<Assignment>> GetByTeacherAsync(int teacherId, bool trackChanges) =>
        await FindByCondition(a => a.TeacherId == teacherId, trackChanges)
            .Include(a => a.Subject)
            .Include(a => a.Class)
            .OrderByDescending(a => a.DueDate)
            .ToListAsync();
}
