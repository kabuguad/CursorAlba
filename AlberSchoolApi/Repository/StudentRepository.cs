using Microsoft.EntityFrameworkCore;
using Contracts.Repositories;
using Repository;
using Entities.Models.User;

namespace Repository;

public class StudentRepository : RepositoryBase<Student>, IStudentRepository
{
    public StudentRepository(RepositoryContext context) : base(context) { }

    public async Task<Student?> GetByUserIdAsync(int userId, bool trackChanges) =>
        await FindByCondition(s => s.UserId == userId, trackChanges)
            .Include(s => s.User)
            .Include(s => s.Class)
            .FirstOrDefaultAsync();

    public async Task<Student?> GetWithDetailsAsync(int id, bool trackChanges) =>
        await FindByCondition(s => s.Id == id, trackChanges)
            .Include(s => s.User)
            .Include(s => s.Class)
            .Include(s => s.Parent)
            .FirstOrDefaultAsync();
}
