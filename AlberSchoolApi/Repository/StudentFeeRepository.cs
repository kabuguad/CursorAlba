using Microsoft.EntityFrameworkCore;
using Contracts.Repositories;
using Entities.Models.Finance;

namespace Repository;

public class StudentFeeRepository : RepositoryBase<StudentFee>, IStudentFeeRepository
{
    public StudentFeeRepository(RepositoryContext context) : base(context) { }

    public async Task<IEnumerable<StudentFee>> GetByStudentAsync(int studentId, bool trackChanges) =>
        await FindByCondition(sf => sf.StudentId == studentId, trackChanges)
            .Include(sf => sf.FeeStructure)
            .OrderByDescending(sf => sf.CreatedAt)
            .ToListAsync();

    public async Task<StudentFee?> GetByIdAsync(int id, bool trackChanges) =>
        await FindByCondition(sf => sf.Id == id, trackChanges)
            .Include(sf => sf.FeeStructure)
            .Include(sf => sf.Payments)
            .FirstOrDefaultAsync();
}
