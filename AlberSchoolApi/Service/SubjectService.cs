using AutoMapper;
using Contracts.Repositories;
using DTOs.Academics;
using Entities.Models.Academics;
using Entities.Exceptions;
using Microsoft.EntityFrameworkCore;
using Service.Contracts;

namespace Service;

public class SubjectService : ISubjectService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public SubjectService(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<IEnumerable<SubjectDto>> GetAllSubjectsAsync(bool trackChanges, int? classId)
    {
        var query = _repositoryManager.SubjectRepository.FindAll(trackChanges);
        if (classId.HasValue)
        {
            query = query.Where(s => s.ClassId == classId.Value);
        }
        var subjects = await query
            .Include(s => s.Class)
            .OrderBy(s => s.ClassId).ThenBy(s => s.Name)
            .ToListAsync();

        return _mapper.Map<IEnumerable<SubjectDto>>(subjects);
    }

    public async Task<SubjectDto?> GetSubjectByIdAsync(int id, bool trackChanges)
    {
        var subject = await _repositoryManager.SubjectRepository
            .FindByCondition(s => s.Id == id, trackChanges)
            .Include(s => s.Class)
            .FirstOrDefaultAsync();

        if (subject == null)
            return null;

        return _mapper.Map<SubjectDto>(subject);
    }

    public async Task<SubjectDto> CreateSubjectAsync(UpsertSubjectDto dto)
    {
        var subject = _mapper.Map<Subject>(dto);
        _repositoryManager.SubjectRepository.Create(subject);
        await _repositoryManager.SaveAsync();

        var createdSubject = await _repositoryManager.SubjectRepository
            .FindByCondition(s => s.Id == subject.Id, false)
            .Include(s => s.Class)
            .FirstOrDefaultAsync();

        return _mapper.Map<SubjectDto>(createdSubject!);
    }

    public async Task UpdateSubjectAsync(int id, UpsertSubjectDto dto)
    {
        var subject = await _repositoryManager.SubjectRepository
            .FindByCondition(s => s.Id == id, true)
            .FirstOrDefaultAsync();

        if (subject == null)
            throw new NotFoundException($"Subject with id {id} not found");

        _mapper.Map(dto, subject);
        subject.UpdatedAt = DateTime.UtcNow;

        _repositoryManager.SubjectRepository.Update(subject);
        await _repositoryManager.SaveAsync();
    }

    public async Task DeleteSubjectAsync(int id)
    {
        var subject = await _repositoryManager.SubjectRepository
            .FindByCondition(s => s.Id == id, true)
            .FirstOrDefaultAsync();

        if (subject == null)
            throw new NotFoundException($"Subject with id {id} not found");

        _repositoryManager.SubjectRepository.Delete(subject);
        await _repositoryManager.SaveAsync();
    }
}