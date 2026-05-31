using Microsoft.EntityFrameworkCore;
using Contracts.Repositories;
using Repository;
using Entities.Models.Academics;

namespace Repository;

public class SubjectRepository : RepositoryBase<Subject>, ISubjectRepository
{
    public SubjectRepository(RepositoryContext context) : base(context) { }

    public async Task<IEnumerable<Subject>> GetByClassAsync(int classId, bool trackChanges) =>
        await FindByCondition(s => s.ClassId == classId, trackChanges)
            .Include(s => s.TimetableEntries)
            .ToListAsync();
}
