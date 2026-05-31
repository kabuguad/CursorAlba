using Microsoft.EntityFrameworkCore;
using Contracts.Repositories;
using Entities.Models.Academics;

namespace Repository;

public class TimetableRepository : RepositoryBase<TimetableEntry>, ITimetableRepository
{
    public TimetableRepository(RepositoryContext context) : base(context) { }

    public async Task<IEnumerable<TimetableEntry>> GetByClassAsync(int classId, bool trackChanges) =>
        await FindByCondition(t => t.ClassId == classId, trackChanges)
            .Include(t => t.Subject)
            .Include(t => t.Teacher).ThenInclude(t => t!.User)
            .OrderBy(t => t.DayOfWeek).ThenBy(t => t.StartTime)
            .ToListAsync();

    public async Task<IEnumerable<TimetableEntry>> GetByTeacherAsync(int teacherId, bool trackChanges) =>
        await FindByCondition(t => t.TeacherId == teacherId, trackChanges)
            .Include(t => t.Subject)
            .Include(t => t.Class)
            .OrderBy(t => t.DayOfWeek).ThenBy(t => t.StartTime)
            .ToListAsync();
}
