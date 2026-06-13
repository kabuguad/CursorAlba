using DTOs.User;
using Entities.Models.User;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Contracts
{
    public interface ITeacherService
    {
        Task<Teacher?> GetByUserIdAsync(int userId, bool trackChanges);
        Task<IEnumerable<Teacher>> GetAllAsync(bool trackChanges);
        Task<IEnumerable<TeacherDto>> GetAllTeachersAsync(bool trackChanges);
        Task<TeacherDto?> GetTeacherByIdAsync(int id, bool trackChanges);
        Task<TeacherDto?> GetTeacherByUserIdAsync(int userId, bool trackChanges);
        Task<TeacherDto> CreateTeacherAsync(TeacherCreateDto dto);
        Task UpdateTeacherAsync(int id, TeacherUpdateDto dto);
        Task DeleteTeacherAsync(int id);
    }
}