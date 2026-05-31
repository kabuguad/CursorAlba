using Entities.Models.User;

namespace Contracts.Repositories;

public interface IStudentRepository : IRepositoryBase<Student>
{
    Task<Student?> GetByUserIdAsync(int userId, bool trackChanges);
    Task<Student?> GetWithDetailsAsync(int id, bool trackChanges);
}
