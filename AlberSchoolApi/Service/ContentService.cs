using AutoMapper;
using Contracts.Repositories;
using DTOs.Content;
using Entities.Models.Content;
using Entities.Exceptions;
using Microsoft.EntityFrameworkCore;
using Service.Contracts;

namespace Service;

public class ContentService : IContentService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public ContentService(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<IEnumerable<SettingDto>> GetAllSettingsAsync(bool trackChanges)
    {
        var settings = await _repositoryManager.SiteSettingRepository.GetAllAsync(trackChanges);
        return _mapper.Map<IEnumerable<SettingDto>>(settings);
    }

    public async Task UpdateSettingsAsync(IEnumerable<SettingDto> dtos)
    {
        foreach (var dto in dtos)
        {
            var existing = await _repositoryManager.SiteSettingRepository.GetByKeyAsync(dto.Key, true);
            if (existing != null)
            {
                existing.Value = dto.Value;
                existing.UpdatedAt = DateTime.UtcNow;
                _repositoryManager.SiteSettingRepository.Update(existing);
            }
            else
            {
                var setting = _mapper.Map<SiteSetting>(dto);
                _repositoryManager.SiteSettingRepository.Create(setting);
            }
        }
        await _repositoryManager.SaveAsync();
    }

    public async Task<IEnumerable<ProgramLevelDto>> GetAllProgramLevelsAsync(bool trackChanges)
    {
        var levels = await _repositoryManager.ProgramLevelRepository.GetAllOrderedAsync(trackChanges);
        return _mapper.Map<IEnumerable<ProgramLevelDto>>(levels);
    }

    public async Task<ProgramLevelDto?> GetProgramLevelByIdAsync(int id, bool trackChanges)
    {
        var level = await _repositoryManager.ProgramLevelRepository
            .FindByCondition(p => p.Id == id, trackChanges)
            .FirstOrDefaultAsync();
        if (level == null)
            return null;

        return _mapper.Map<ProgramLevelDto>(level);
    }

    public async Task<ProgramLevelDto> CreateProgramLevelAsync(UpsertProgramLevelDto dto)
    {
        var level = _mapper.Map<ProgramLevel>(dto);
        _repositoryManager.ProgramLevelRepository.Create(level);
        await _repositoryManager.SaveAsync();

        var createdLevel = await _repositoryManager.ProgramLevelRepository
            .FindByCondition(p => p.Id == level.Id, false)
            .FirstOrDefaultAsync();

        return _mapper.Map<ProgramLevelDto>(createdLevel!);
    }

    public async Task UpdateProgramLevelAsync(int id, UpsertProgramLevelDto dto)
    {
        var level = await _repositoryManager.ProgramLevelRepository
            .FindByCondition(p => p.Id == id, true)
            .FirstOrDefaultAsync();

        if (level == null)
            throw new NotFoundException($"ProgramLevel with id {id} not found");

        _mapper.Map(dto, level);
        level.UpdatedAt = DateTime.UtcNow;

        _repositoryManager.ProgramLevelRepository.Update(level);
        await _repositoryManager.SaveAsync();
    }

    public async Task DeleteProgramLevelAsync(int id)
    {
        var level = await _repositoryManager.ProgramLevelRepository
            .FindByCondition(p => p.Id == id, true)
            .FirstOrDefaultAsync();

        if (level == null)
            throw new NotFoundException($"ProgramLevel with id {id} not found");

        _repositoryManager.ProgramLevelRepository.Delete(level);
        await _repositoryManager.SaveAsync();
    }

    public async Task<IEnumerable<PublicFeeRowDto>> GetAllPublicFeeRowsAsync(bool trackChanges)
    {
        var rows = await _repositoryManager.PublicFeeRowRepository.GetAllOrderedAsync(trackChanges);
        return _mapper.Map<IEnumerable<PublicFeeRowDto>>(rows);
    }

    public async Task<PublicFeeRowDto?> GetPublicFeeRowByIdAsync(int id, bool trackChanges)
    {
        var row = await _repositoryManager.PublicFeeRowRepository
            .FindByCondition(f => f.Id == id, trackChanges)
            .FirstOrDefaultAsync();
        if (row == null)
            return null;

        return _mapper.Map<PublicFeeRowDto>(row);
    }

    public async Task<PublicFeeRowDto> CreatePublicFeeRowAsync(UpsertPublicFeeRowDto dto)
    {
        var row = _mapper.Map<PublicFeeRow>(dto);
        _repositoryManager.PublicFeeRowRepository.Create(row);
        await _repositoryManager.SaveAsync();

        var createdRow = await _repositoryManager.PublicFeeRowRepository
            .FindByCondition(f => f.Id == row.Id, false)
            .FirstOrDefaultAsync();

        return _mapper.Map<PublicFeeRowDto>(createdRow!);
    }

    public async Task UpdatePublicFeeRowAsync(int id, UpsertPublicFeeRowDto dto)
    {
        var row = await _repositoryManager.PublicFeeRowRepository
            .FindByCondition(f => f.Id == id, true)
            .FirstOrDefaultAsync();

        if (row == null)
            throw new NotFoundException($"PublicFeeRow with id {id} not found");

        _mapper.Map(dto, row);
        row.UpdatedAt = DateTime.UtcNow;

        _repositoryManager.PublicFeeRowRepository.Update(row);
        await _repositoryManager.SaveAsync();
    }

    public async Task DeletePublicFeeRowAsync(int id)
    {
        var row = await _repositoryManager.PublicFeeRowRepository
            .FindByCondition(f => f.Id == id, true)
            .FirstOrDefaultAsync();

        if (row == null)
            throw new NotFoundException($"PublicFeeRow with id {id} not found");

        _repositoryManager.PublicFeeRowRepository.Delete(row);
        await _repositoryManager.SaveAsync();
    }
}