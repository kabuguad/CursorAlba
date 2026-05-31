using Microsoft.EntityFrameworkCore;
using Contracts.Repositories;
using Repository;
using Entities.Models.Grade;

namespace Repository;

public class GradeRepository : RepositoryBase<Grade>, IGradeRepository
{
    public GradeRepository(RepositoryContext context) : base(context) { }

    public async Task<IEnumerable<Grade>> GetByStudentAsync(int studentId, bool trackChanges) =>
        await FindByCondition(g => g.StudentId == studentId && !g.IsDeleted, trackChanges)
            .Include(g => g.Subject)
            .ToListAsync();

    public async Task<IEnumerable<Grade>> GetByClassAndSubjectAsync(int classId, int subjectId, bool trackChanges) =>
        await Context.Grades
            .Where(g => !g.IsDeleted)
            .Include(g => g.Student)
            .ThenInclude(s => s!.User)
            .Where(g => g.Subject!.ClassId == classId && g.SubjectId == subjectId)
            .ToListAsync();
}
