using Entities.Models.User;

namespace Contracts.Repositories;

public interface IParentRepository : IRepositoryBase<Parent>
{
    Task<Parent?> GetByUserIdAsync(int userId, bool trackChanges);
    Task<IEnumerable<Student>> GetChildrenAsync(int parentId);
}
