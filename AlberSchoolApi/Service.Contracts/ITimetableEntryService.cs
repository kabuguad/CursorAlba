using DTOs.Academics;
using Entities.Models.Academics;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Contracts
{
    public interface ITimetableEntryService
    {
        Task<IEnumerable<TimetableEntryDto>> GetByClassAsync(int classId, bool trackChanges);
        Task<IEnumerable<TimetableEntryDto>> GetByTeacherAsync(int teacherId, bool trackChanges);
        Task<TimetableEntryDto?> GetByIdAsync(int id, bool trackChanges);
        Task<TimetableEntryDto> CreateAsync(TimetableEntryDto dto);
        Task UpdateAsync(int id, TimetableEntryDto dto);
        Task DeleteAsync(int id);
    }
}