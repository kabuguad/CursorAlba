using DTOs.Academics;
using Entities.Models.Academics;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Contracts
{
    public interface IClassService
    {
        Task<IEnumerable<ClassDto>> GetAllClassesAsync(bool trackChanges);
        Task<ClassDto?> GetClassByIdAsync(int id, bool trackChanges);
        Task<ClassDto> CreateClassAsync(DTOs.Academics.UpsertClassDto dto);
        Task UpdateClassAsync(int id, DTOs.Academics.UpsertClassDto dto);
        Task DeleteClassAsync(int id);
        Task<IEnumerable<ClassDto>> GetClassesByTeacherIdAsync(int teacherId, bool trackChanges);
        Task<int> GetStudentCountForClassAsync(int classId, bool trackChanges);
    }
}