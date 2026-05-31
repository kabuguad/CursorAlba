using Microsoft.EntityFrameworkCore;
using Contracts.Repositories;
using Repository;
using Entities.Models.Finance;

namespace Repository;

public class FeeRepository : RepositoryBase<FeeStructure>, IFeeRepository
{
    public FeeRepository(RepositoryContext context) : base(context) { }

    public async Task<IEnumerable<FeeStructure>> GetByClassAsync(int classId, bool trackChanges) =>
        await FindByCondition(f => f.ClassId == classId, trackChanges)
            .OrderBy(f => f.Term)
            .ToListAsync();

    public async Task<IEnumerable<StudentFee>> GetByStudentAsync(int studentId, bool trackChanges) =>
        await Context.StudentFees
            .Where(sf => sf.StudentId == studentId)
            .Include(sf => sf.FeeStructure)
            .OrderByDescending(sf => sf.CreatedAt)
            .ToListAsync();
}
