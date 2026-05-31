using Microsoft.EntityFrameworkCore;
using Contracts.Repositories;
using Repository;
using Entities.Models.User;

namespace Repository;

public class TeacherRepository : RepositoryBase<Teacher>, ITeacherRepository
{
    public TeacherRepository(RepositoryContext context) : base(context) { }

    public async Task<Teacher?> GetByUserIdAsync(int userId, bool trackChanges) =>
        await FindByCondition(t => t.UserId == userId, trackChanges)
            .Include(t => t.User)
            .FirstOrDefaultAsync();
}
