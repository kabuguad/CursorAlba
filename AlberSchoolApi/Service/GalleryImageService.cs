using AutoMapper;
using Contracts.Repositories;
using Entities.Exceptions;
using Entities.Models.Content;
using Microsoft.EntityFrameworkCore;
using Service.Contracts;

namespace Service;

public class GalleryImageService : IGalleryImageService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public GalleryImageService(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<IEnumerable<GalleryImage>> GetPublicAsync(bool trackChanges)
    {
        return await _repositoryManager.GalleryImageRepository.GetPublicAsync(trackChanges);
    }

    public async Task<IEnumerable<GalleryImage>> GetAllAsync(bool trackChanges)
    {
        return await _repositoryManager.GalleryImageRepository.FindAll(trackChanges)
            .OrderBy(g => g.SortOrder)
            .ToListAsync();
    }

    public async Task<GalleryImage> AddAsync(GalleryImage image)
    {
        _repositoryManager.GalleryImageRepository.Create(image);
        await _repositoryManager.SaveAsync();
        return image;
    }

    public async Task DeleteAsync(int id)
    {
        var image = await _repositoryManager.GalleryImageRepository
            .FindByCondition(g => g.Id == id, true)
            .FirstOrDefaultAsync();

        if (image == null)
            throw new NotFoundException($"GalleryImage with id {id} not found.");

        _repositoryManager.GalleryImageRepository.Delete(image);
        await _repositoryManager.SaveAsync();
    }
}

