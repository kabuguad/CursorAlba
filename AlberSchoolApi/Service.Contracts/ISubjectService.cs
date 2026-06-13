using DTOs.Academics;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Contracts
{
    public interface ISubjectService
    {
        Task<IEnumerable<SubjectDto>> GetAllSubjectsAsync(bool trackChanges, int? classId);
        Task<SubjectDto?> GetSubjectByIdAsync(int id, bool trackChanges);
        Task<SubjectDto> CreateSubjectAsync(UpsertSubjectDto dto);
        Task UpdateSubjectAsync(int id, UpsertSubjectDto dto);
        Task DeleteSubjectAsync(int id);
    }
}