using AutoMapper;
using Contracts.Repositories;
using DTOs.Content;
using Entities.Exceptions;
using Entities.Models.Content;
using Microsoft.EntityFrameworkCore;
using Service.Contracts;

namespace Service;

public class TheAlberDifferenceService : ITheAlberDifferenceService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public TheAlberDifferenceService(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<IEnumerable<TheAlberDifferenceDto>> GetAllAsync(bool trackChanges)
    {
        var differences = await _repositoryManager.AlberDifferenceRepository
            .FindAll(trackChanges)
            .OrderBy(d => d.SortOrder)
            .ToListAsync();
        return _mapper.Map<IEnumerable<TheAlberDifferenceDto>>(differences);
    }

    public async Task<TheAlberDifferenceDto> GetByIdAsync(int id, bool trackChanges)
    {
        var difference = await _repositoryManager.AlberDifferenceRepository
            .FindByCondition(d => d.Id == id, trackChanges)
            .FirstOrDefaultAsync();
        if (difference == null)
            throw new NotFoundException($"TheAlberDifference with id {id} not found.");
        return _mapper.Map<TheAlberDifferenceDto>(difference);
    }

    public async Task<TheAlberDifferenceDto> CreateAsync(TheAlberDifferenceCreateDto dto)
    {
        var difference = _mapper.Map<TheAlberDifference>(dto);
        _repositoryManager.AlberDifferenceRepository.Create(difference);
        await _repositoryManager.SaveAsync();
        return _mapper.Map<TheAlberDifferenceDto>(difference);
    }

    public async Task UpdateAsync(int id, TheAlberDifferenceUpdateDto dto)
    {
        var existing = await _repositoryManager.AlberDifferenceRepository
            .FindByCondition(d => d.Id == id, true)
            .FirstOrDefaultAsync();

        if (existing == null)
            throw new NotFoundException($"TheAlberDifference with id {id} not found.");

        existing.Icon = dto.Icon;
        existing.BadgeName = dto.BadgeName;
        existing.Name = dto.Name;
        existing.Description = dto.Description;
        existing.SortOrder = dto.SortOrder;

        _repositoryManager.Update(existing);
        await _repositoryManager.SaveAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var difference = await _repositoryManager.AlberDifferenceRepository
            .FindByCondition(d => d.Id == id, true)
            .FirstOrDefaultAsync();

        if (difference == null)
            throw new NotFoundException($"TheAlberDifference with id {id} not found.");

        _repositoryManager.AlberDifferenceRepository.Delete(difference);
        await _repositoryManager.SaveAsync();
    }
}