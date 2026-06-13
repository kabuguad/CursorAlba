using DTOs.Academics;
using Entities.Models.Academics;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Contracts
{
    public interface IAssignmentService
    {
        Task<IEnumerable<AssignmentDto>> GetByClassAsync(int classId, bool trackChanges);
        Task<IEnumerable<AssignmentDto>> GetByTeacherAsync(int teacherId, bool trackChanges);
        Task<AssignmentDto?> GetByIdAsync(int id, bool trackChanges);
        Task<AssignmentDto> CreateAsync(AssignmentCreateDto dto, int teacherId);
        Task UpdateAsync(int id, AssignmentCreateDto dto);
        Task DeleteAsync(int id);
    }
}