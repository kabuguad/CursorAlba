using Contracts.Repositories;
using Entities.Models.Content;
using Microsoft.EntityFrameworkCore;

namespace Repository;

public class ProgramLevelRepository : RepositoryBase<ProgramLevel>, IProgramLevelRepository
{
    public ProgramLevelRepository(RepositoryContext context) : base(context) { }

    public async Task<IEnumerable<ProgramLevel>> GetAllOrderedAsync(bool trackChanges) =>
        await FindAll(trackChanges).OrderBy(p => p.SortOrder).ToListAsync();
}
