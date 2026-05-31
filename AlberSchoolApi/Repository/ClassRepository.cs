using Microsoft.EntityFrameworkCore;
using Contracts.Repositories;
using Repository;
using Entities.Models.Academics;

namespace Repository;

public class ClassRepository : RepositoryBase<Class>, IClassRepository
{
    public ClassRepository(RepositoryContext context) : base(context) { }

    public async Task<IEnumerable<Class>> GetAllWithDetailsAsync(bool trackChanges) =>
        await FindAll(trackChanges)
            .Include(c => c.Subjects)
            .Include(c => c.Students)
            .ToListAsync();
}
