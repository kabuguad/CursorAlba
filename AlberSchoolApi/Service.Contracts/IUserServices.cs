using DTOs.User;
using Entities.Models.User;

namespace Service.Contracts;

public interface IStudentService
{
    Task<Student?> GetByUserIdAsync(int userId, bool trackChanges);
    Task<Student?> GetWithDetailsAsync(int id, bool trackChanges);
    Task<IEnumerable<UserResponseDto>> GetAllStudentsAsync(bool trackChanges);
}

public interface ITeacherService
{
    Task<Teacher?> GetByUserIdAsync(int userId, bool trackChanges);
    Task<IEnumerable<Teacher>> GetAllAsync(bool trackChanges);
}

public interface IParentService
{
    Task<Parent?> GetByUserIdAsync(int userId, bool trackChanges);
    Task<IEnumerable<Student>> GetChildrenAsync(int parentId);
}
