using AutoMapper;
using Contracts.Repositories;
using DTOs.Academics;
using Entities.Models.Academics;
using Entities.Exceptions;
using Microsoft.EntityFrameworkCore;
using Service.Contracts;

namespace Service;

public class AssignmentService : IAssignmentService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public AssignmentService(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<IEnumerable<AssignmentDto>> GetByClassAsync(int classId, bool trackChanges)
    {
        var assignments = await _repositoryManager.AssignmentRepository.GetByClassAsync(classId, trackChanges);
        return _mapper.Map<IEnumerable<AssignmentDto>>(assignments);
    }

    public async Task<IEnumerable<AssignmentDto>> GetByTeacherAsync(int teacherId, bool trackChanges)
    {
        var assignments = await _repositoryManager.AssignmentRepository.GetByTeacherAsync(teacherId, trackChanges);
        return _mapper.Map<IEnumerable<AssignmentDto>>(assignments);
    }

    public async Task<AssignmentDto?> GetByIdAsync(int id, bool trackChanges)
    {
        var assignment = await _repositoryManager.AssignmentRepository
            .FindByCondition(a => a.Id == id, trackChanges)
            .Include(a => a.Subject)
            .Include(a => a.Class)
            .Include(a => a.Teacher)
                .ThenInclude(t => t!.User)
            .FirstOrDefaultAsync();

        if (assignment == null)
            return null;

        return _mapper.Map<AssignmentDto>(assignment);
    }

    public async Task<AssignmentDto> CreateAsync(AssignmentCreateDto dto, int teacherId)
    {
        var assignment = _mapper.Map<Assignment>(dto);
        assignment.TeacherId = teacherId;
        _repositoryManager.AssignmentRepository.Create(assignment);
        await _repositoryManager.SaveAsync();

        var createdAssignment = await _repositoryManager.AssignmentRepository
            .FindByCondition(a => a.Id == assignment.Id, false)
            .Include(a => a.Subject)
            .Include(a => a.Class)
            .Include(a => a.Teacher)
                .ThenInclude(t => t!.User)
            .FirstOrDefaultAsync();

        return _mapper.Map<AssignmentDto>(createdAssignment!);
    }

    public async Task UpdateAsync(int id, AssignmentCreateDto dto)
    {
        var assignment = await _repositoryManager.AssignmentRepository
            .FindByCondition(a => a.Id == id, true)
            .FirstOrDefaultAsync();

        if (assignment == null)
            throw new NotFoundException($"Assignment with id {id} not found");

        _mapper.Map(dto, assignment);
        assignment.UpdatedAt = DateTime.UtcNow;

        _repositoryManager.AssignmentRepository.Update(assignment);
        await _repositoryManager.SaveAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var assignment = await _repositoryManager.AssignmentRepository
            .FindByCondition(a => a.Id == id, true)
            .FirstOrDefaultAsync();

        if (assignment == null)
            throw new NotFoundException($"Assignment with id {id} not found");

        _repositoryManager.AssignmentRepository.Delete(assignment);
        await _repositoryManager.SaveAsync();
    }
}