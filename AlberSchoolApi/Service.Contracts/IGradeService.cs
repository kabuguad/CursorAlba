using DTOs.Grade;

namespace Service.Contracts;

public interface IGradeService
{
    Task<IEnumerable<GradeResponseDto>> GetGradesForStudentAsync(int studentId, bool trackChanges);
    Task<IEnumerable<GradeResponseDto>> GetGradesForClassAsync(int classId, int subjectId, bool trackChanges);
    Task<GradeResponseDto> CreateGradeAsync(GradeCreateDto dto);
}
