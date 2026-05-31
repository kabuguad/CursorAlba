using AutoMapper;
using Contracts.Repositories;
using DTOs.User;
using Microsoft.EntityFrameworkCore;
using Entities.Exceptions;
using Entities.Models.User;
using Service.Contracts;

namespace Service;

public class StudentService : IStudentService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public StudentService(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<Student?> GetByUserIdAsync(int userId, bool trackChanges)
    {
        return await _repositoryManager.StudentRepository.GetByUserIdAsync(userId, trackChanges);
    }

    public async Task<Student?> GetWithDetailsAsync(int id, bool trackChanges)
    {
        return await _repositoryManager.StudentRepository.GetWithDetailsAsync(id, trackChanges);
    }

    public async Task<IEnumerable<UserResponseDto>> GetAllStudentsAsync(bool trackChanges)
    {
        var students = await _repositoryManager.StudentRepository
            .FindAll(trackChanges)
            .Include(s => s.User)
            .ToListAsync();

        return _mapper.Map<IEnumerable<UserResponseDto>>(students.Select(s => s.User));
    }
}

