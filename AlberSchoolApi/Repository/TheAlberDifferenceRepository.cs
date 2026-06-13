using Contracts.Repositories;
using Entities.Models.Content;

namespace Repository;

public class TheAlberDifferenceRepository : RepositoryBase<TheAlberDifference>, ITheAlberDifferenceRepository
{
    public TheAlberDifferenceRepository(RepositoryContext context) : base(context) { }
}