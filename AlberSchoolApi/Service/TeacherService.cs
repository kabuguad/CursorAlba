using AutoMapper;
using Contracts.Repositories;
using DTOs.User;
using Microsoft.EntityFrameworkCore;
using Entities.Models.User;
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
}

