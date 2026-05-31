using Microsoft.EntityFrameworkCore;
using Contracts.Repositories;
using Repository;
using Entities.Models.User;

namespace Repository;

public class ParentRepository : RepositoryBase<Parent>, IParentRepository
{
    public ParentRepository(RepositoryContext context) : base(context) { }

    public async Task<Parent?> GetByUserIdAsync(int userId, bool trackChanges) =>
        await FindByCondition(p => p.UserId == userId, trackChanges)
            .Include(p => p.User)
            .FirstOrDefaultAsync();

    public async Task<IEnumerable<Student>> GetChildrenAsync(int parentId) =>
        await Context.Students
            .Where(s => s.ParentId == parentId)
            .Include(s => s.User)
            .Include(s => s.Class)
            .ToListAsync();
}
