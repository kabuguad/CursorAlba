using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Contracts.Repositories;
using DTOs.Academics;
using Entities.Models.Academics;
using Entities.Exceptions;
using Microsoft.EntityFrameworkCore;
using Service.Contracts;

namespace Service;

public class ClassService : IClassService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public ClassService(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ClassDto>> GetAllClassesAsync(bool trackChanges)
    {
        var classes = await _repositoryManager.ClassRepository
            .FindAll(trackChanges)
            .ToListAsync();

        // We need to get student counts for each class
        // We can do this efficiently by grouping students by classid
        var studentCounts = await _repositoryManager.StudentRepository
            .FindAll(trackChanges)
            .GroupBy(s => s.ClassId)
            .ToDictionaryAsync(g => g.Key, g => g.Count());

        var classDtos = _mapper.Map<IEnumerable<ClassDto>>(classes);
        foreach (var dto in classDtos)
        {
            dto.StudentCount = studentCounts.TryGetValue(dto.Id, out var cnt) ? cnt : 0;
        }
        return classDtos;
    }

    public async Task<ClassDto?> GetClassByIdAsync(int id, bool trackChanges)
    {
        var @class = await _repositoryManager.ClassRepository
            .FindByCondition(c => c.Id == id, trackChanges)
            .FirstOrDefaultAsync();

        if (@class == null)
            return null;

        // Get student count for this class
        var studentCount = await _repositoryManager.StudentRepository
            .FindByCondition(s => s.ClassId == id, trackChanges)
            .CountAsync();

        var dto = _mapper.Map<ClassDto>(@class);
        dto.StudentCount = studentCount;
        return dto;
    }

    public async Task<ClassDto> CreateClassAsync(UpsertClassDto dto)
    {
        var @class = _mapper.Map<Class>(dto);
        _repositoryManager.ClassRepository.Create(@class);
        await _repositoryManager.SaveAsync();

        var createdClass = await _repositoryManager.ClassRepository
            .FindByCondition(c => c.Id == @class.Id, false)
            .FirstOrDefaultAsync();

        // Get student count for the created class (should be 0)
        var studentCount = await _repositoryManager.StudentRepository
            .FindByCondition(s => s.ClassId == @class.Id, false)
            .CountAsync();

        var resultDto = _mapper.Map<ClassDto>(createdClass!);
        resultDto.StudentCount = studentCount;
        return resultDto;
    }

    public async Task UpdateClassAsync(int id, UpsertClassDto dto)
    {
        var @class = await _repositoryManager.ClassRepository
            .FindByCondition(c => c.Id == id, true)
            .FirstOrDefaultAsync();

        if (@class == null)
            throw new NotFoundException($"Class with id {id} not found");

        _mapper.Map(dto, @class);
        @class.UpdatedAt = DateTime.UtcNow;

        _repositoryManager.ClassRepository.Update(@class);
        await _repositoryManager.SaveAsync();
    }

    public async Task DeleteClassAsync(int id)
    {
        var @class = await _repositoryManager.ClassRepository
            .FindByCondition(c => c.Id == id, true)
            .FirstOrDefaultAsync();

        if (@class == null)
            throw new NotFoundException($"Class with id {id} not found");

        _repositoryManager.ClassRepository.Delete(@class);
        await _repositoryManager.SaveAsync();
    }

    public async Task<IEnumerable<ClassDto>> GetClassesByTeacherIdAsync(int teacherId, bool trackChanges)
    {
        // Get distinct class IDs from timetable entries for this teacher
        var classIds = await _repositoryManager.TimetableRepository
            .FindByCondition(t => t.TeacherId == teacherId, trackChanges)
            .Select(t => t.ClassId)
            .Distinct()
            .ToListAsync();

        // Get the classes
        var classes = await _repositoryManager.ClassRepository
            .FindByCondition(c => classIds.Contains(c.Id), trackChanges)
            .ToListAsync();

        // Get student counts for these classes
        var studentCounts = await _repositoryManager.StudentRepository
            .FindByCondition(s => classIds.Contains(s.ClassId), trackChanges)
            .GroupBy(s => s.ClassId)
            .ToDictionaryAsync(g => g.Key, g => g.Count());

        // Map to DTOs and add student counts
        var classDtos = _mapper.Map<IEnumerable<ClassDto>>(classes);
        foreach (var dto in classDtos)
        {
            dto.StudentCount = studentCounts.TryGetValue(dto.Id, out var cnt) ? cnt : 0;
        }
        return classDtos;
    }

    public async Task<int> GetStudentCountForClassAsync(int classId, bool trackChanges)
    {
        return await _repositoryManager.StudentRepository
            .FindByCondition(s => s.ClassId == classId, trackChanges)
            .CountAsync();
    }
}