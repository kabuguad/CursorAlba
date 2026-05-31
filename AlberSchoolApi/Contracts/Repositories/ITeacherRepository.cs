using Entities.Models.User;

namespace Contracts.Repositories;

public interface ITeacherRepository : IRepositoryBase<Teacher>
{
    Task<Teacher?> GetByUserIdAsync(int userId, bool trackChanges);
}
