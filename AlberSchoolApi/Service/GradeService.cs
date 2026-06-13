using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Contracts.Repositories;
using DTOs.Grade;
using DTOs.User;
using Entities.Exceptions;
using Entities.Models.Grade;
using Entities.Models.User;
using Service.Contracts;

namespace Service;

public class GradeService : IGradeService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public GradeService(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<IEnumerable<GradeResponseDto>> GetGradesForStudentAsync(int studentId, bool trackChanges)
    {
        var grades = await _repositoryManager.GradeRepository.GetByStudentAsync(studentId, trackChanges);
        return _mapper.Map<IEnumerable<GradeResponseDto>>(grades);
    }

    public async Task<IEnumerable<GradeResponseDto>> GetGradesForClassAsync(int classId, int subjectId, bool trackChanges)
    {
        var grades = await _repositoryManager.GradeRepository.GetByClassAndSubjectAsync(classId, subjectId, trackChanges);
        return _mapper.Map<IEnumerable<GradeResponseDto>>(grades);
    }

    public async Task<IEnumerable<GradeResponseDto>> GetGradesForClassAsync(int classId, bool trackChanges)
    {
        var grades = await _repositoryManager.GradeRepository
            .FindByCondition(g => !g.IsDeleted, trackChanges)
            .Include(g => g.Subject)
            .Include(g => g.Student).ThenInclude(s => s!.User)
            .Where(g => g.Subject.ClassId == classId)
            .ToListAsync();
        return _mapper.Map<IEnumerable<GradeResponseDto>>(grades);
    }

    public async Task<GradeResponseDto> CreateGradeAsync(GradeCreateDto dto)
    {
        var grade = _mapper.Map<Grade>(dto);
        _repositoryManager.GradeRepository.Create(grade);
        await _repositoryManager.SaveAsync();

        var response = _mapper.Map<GradeResponseDto>(grade);
        return response;
    }

    public async Task<GradeResponseDto> UpsertGradeAsync(GradeCreateDto dto)
    {
        var existing = await _repositoryManager.GradeRepository
            .FindByCondition(g => g.StudentId == dto.StudentId
                && g.SubjectId == dto.SubjectId
                && g.AssessmentType == dto.AssessmentType, false)
            .FirstOrDefaultAsync();

        if (existing != null)
        {
            existing.Score = dto.Score;
            existing.MaxScore = dto.MaxScore;
            existing.AssessmentDate = dto.AssessmentDate;
            existing.Remarks = dto.Remarks;
            _repositoryManager.GradeRepository.Update(existing);
        }
        else
        {
            var grade = _mapper.Map<Grade>(dto);
            _repositoryManager.GradeRepository.Create(grade);
        }

        await _repositoryManager.SaveAsync();

        var gradeToReturn = existing ?? await _repositoryManager.GradeRepository
            .FindByCondition(g => g.StudentId == dto.StudentId
                && g.SubjectId == dto.SubjectId
                && g.AssessmentType == dto.AssessmentType, false)
            .FirstOrDefaultAsync();

        return _mapper.Map<GradeResponseDto>(gradeToReturn!);
    }
}
