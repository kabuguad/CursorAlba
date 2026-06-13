using AutoMapper;
using Contracts.Repositories;
using DTOs.Academics;
using Entities.Models.Academics;
using Entities.Exceptions;
using Microsoft.EntityFrameworkCore;
using Service.Contracts;

namespace Service;

public class TimetableEntryService : ITimetableEntryService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public TimetableEntryService(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<IEnumerable<TimetableEntryDto>> GetByClassAsync(int classId, bool trackChanges)
    {
        var entries = await _repositoryManager.TimetableRepository.GetByClassAsync(classId, trackChanges);
        return _mapper.Map<IEnumerable<TimetableEntryDto>>(entries);
    }

    public async Task<IEnumerable<TimetableEntryDto>> GetByTeacherAsync(int teacherId, bool trackChanges)
    {
        var entries = await _repositoryManager.TimetableRepository.GetByTeacherAsync(teacherId, trackChanges);
        return _mapper.Map<IEnumerable<TimetableEntryDto>>(entries);
    }

    public async Task<TimetableEntryDto?> GetByIdAsync(int id, bool trackChanges)
    {
        var entry = await _repositoryManager.TimetableRepository
            .FindByCondition(t => t.Id == id, trackChanges)
            .Include(t => t.Subject)
            .Include(t => t.Class)
            .Include(t => t.Teacher)
                .ThenInclude(t => t!.User)
            .FirstOrDefaultAsync();

        if (entry == null)
            return null;

        return _mapper.Map<TimetableEntryDto>(entry);
    }

    public async Task<TimetableEntryDto> CreateAsync(TimetableEntryDto dto)
    {
        var entry = _mapper.Map<TimetableEntry>(dto);
        _repositoryManager.TimetableRepository.Create(entry);
        await _repositoryManager.SaveAsync();

        var createdEntry = await _repositoryManager.TimetableRepository
            .FindByCondition(t => t.Id == entry.Id, false)
            .Include(t => t.Subject)
            .Include(t => t.Class)
            .Include(t => t.Teacher)
                .ThenInclude(t => t!.User)
            .FirstOrDefaultAsync();

        return _mapper.Map<TimetableEntryDto>(createdEntry!);
    }

    public async Task UpdateAsync(int id, TimetableEntryDto dto)
    {
        var entry = await _repositoryManager.TimetableRepository
            .FindByCondition(t => t.Id == id, true)
            .FirstOrDefaultAsync();

        if (entry == null)
            throw new NotFoundException($"TimetableEntry with id {id} not found");

        _mapper.Map(dto, entry);
        entry.UpdatedAt = DateTime.UtcNow;

        _repositoryManager.TimetableRepository.Update(entry);
        await _repositoryManager.SaveAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entry = await _repositoryManager.TimetableRepository
            .FindByCondition(t => t.Id == id, true)
            .FirstOrDefaultAsync();

        if (entry == null)
            throw new NotFoundException($"TimetableEntry with id {id} not found");

        _repositoryManager.TimetableRepository.Delete(entry);
        await _repositoryManager.SaveAsync();
    }
}