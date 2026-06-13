using AutoMapper;
using Contracts.Repositories;
using DTOs.User;
using Entities.Exceptions;
using Entities.Models.User;
using Microsoft.EntityFrameworkCore;
using Service.Contracts;

namespace Service;

public class TeacherService : ITeacherService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public TeacherService(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<Teacher?> GetByUserIdAsync(int userId, bool trackChanges)
    {
        return await _repositoryManager.TeacherRepository.GetByUserIdAsync(userId, trackChanges);
    }

    public async Task<IEnumerable<Teacher>> GetAllAsync(bool trackChanges)
    {
        return await _repositoryManager.TeacherRepository
            .FindAll(trackChanges)
            .Include(t => t.User)
            .ToListAsync();
    }

    public async Task<IEnumerable<TeacherDto>> GetAllTeachersAsync(bool trackChanges)
    {
        var teachers = await _repositoryManager.TeacherRepository
            .FindAll(trackChanges)
            .Include(t => t.User)
            .ToListAsync();
        return _mapper.Map<IEnumerable<TeacherDto>>(teachers);
    }

    public async Task<TeacherDto?> GetTeacherByIdAsync(int id, bool trackChanges)
    {
        var teacher = await _repositoryManager.TeacherRepository
            .FindByCondition(t => t.Id == id, trackChanges)
            .Include(t => t.User)
            .FirstOrDefaultAsync();
        if (teacher == null)
            return null;

        return _mapper.Map<TeacherDto>(teacher);
    }

    public async Task<TeacherDto?> GetTeacherByUserIdAsync(int userId, bool trackChanges)
    {
        var teacher = await _repositoryManager.TeacherRepository
            .GetByUserIdAsync(userId, trackChanges);
        if (teacher == null)
            return null;

        return _mapper.Map<TeacherDto>(teacher);
    }

    public async Task<TeacherDto> CreateTeacherAsync(TeacherCreateDto dto)
    {
        var teacher = _mapper.Map<Teacher>(dto);
        _repositoryManager.TeacherRepository.Create(teacher);
        await _repositoryManager.SaveAsync();

        var createdTeacher = await _repositoryManager.TeacherRepository
            .FindByCondition(t => t.Id == teacher.Id, false)
            .Include(t => t.User)
            .FirstOrDefaultAsync();

        return _mapper.Map<TeacherDto>(createdTeacher!);
    }

    public async Task UpdateTeacherAsync(int id, TeacherUpdateDto dto)
    {
        var teacher = await _repositoryManager.TeacherRepository
            .FindByCondition(t => t.Id == id, true)
            .FirstOrDefaultAsync();

        if (teacher == null)
            throw new NotFoundException($"Teacher with id {id} not found");

        _mapper.Map(dto, teacher);
        teacher.UpdatedAt = DateTime.UtcNow;

        _repositoryManager.TeacherRepository.Update(teacher);
        await _repositoryManager.SaveAsync();
    }

    public async Task DeleteTeacherAsync(int id)
    {
        var teacher = await _repositoryManager.TeacherRepository
            .FindByCondition(t => t.Id == id, true)
            .FirstOrDefaultAsync();

        if (teacher == null)
            throw new NotFoundException($"Teacher with id {id} not found");

        _repositoryManager.TeacherRepository.Delete(teacher);
        await _repositoryManager.SaveAsync();
    }
}

