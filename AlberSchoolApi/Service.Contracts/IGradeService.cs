using DTOs.Grade;
using Entities.Models.Grade;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Contracts
{
    public interface IGradeService
    {
        Task<IEnumerable<GradeResponseDto>> GetGradesForStudentAsync(int studentId, bool trackChanges);
        Task<IEnumerable<GradeResponseDto>> GetGradesForClassAsync(int classId, int subjectId, bool trackChanges);
        Task<IEnumerable<GradeResponseDto>> GetGradesForClassAsync(int classId, bool trackChanges);
        Task<GradeResponseDto> CreateGradeAsync(GradeCreateDto dto);
        Task<GradeResponseDto> UpsertGradeAsync(GradeCreateDto dto);
    }
}
