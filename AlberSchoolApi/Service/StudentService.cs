using AutoMapper;
using Contracts.Repositories;
using DTOs.Finance;
using DTOs.Student;
using DTOs.User;
using Entities.Exceptions;
using Entities.Models.User;
using Microsoft.EntityFrameworkCore;
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

    public async Task<IEnumerable<UserResponseDto>> GetAllStudentUsersAsync(bool trackChanges)
    {
        var students = await _repositoryManager.StudentRepository
            .FindAll(trackChanges)
            .Include(s => s.User)
            .ToListAsync();

        return _mapper.Map<IEnumerable<UserResponseDto>>(students.Select(s => s.User));
    }

    public async Task<IEnumerable<StudentDto>> GetAllStudentsAsync(bool trackChanges)
    {
        var students = await _repositoryManager.StudentRepository
            .FindAll(trackChanges)
            .Include(s => s.User)
            .Include(s => s.Class)
            .Include(s => s.Parent)
                .ThenInclude(p => p!.User)
            .ToListAsync();

        return _mapper.Map<IEnumerable<StudentDto>>(students);
    }

    public async Task<StudentDto?> GetStudentByIdAsync(int id, bool trackChanges)
    {
        var student = await _repositoryManager.StudentRepository
            .FindByCondition(s => s.Id == id, trackChanges)
            .Include(s => s.User)
            .Include(s => s.Class)
            .Include(s => s.Parent)
                .ThenInclude(p => p!.User)
            .FirstOrDefaultAsync();

        if (student == null)
            return null;

        return _mapper.Map<StudentDto>(student);
    }

    public async Task<StudentDto> CreateStudentAsync(int userId, StudentCreateDto dto)
    {
        var student = new Entities.Models.User.Student
        {
            UserId = userId,
            ClassId = dto.ClassId,
            ParentId = dto.ParentId,
            DateOfBirth = dto.DateOfBirth.HasValue ? dto.DateOfBirth.Value.ToUniversalTime() : null,
            Gender = dto.Gender,
            Address = dto.Address
        };

        _repositoryManager.StudentRepository.Create(student);
        await _repositoryManager.SaveAsync();

        var createdStudent = await _repositoryManager.StudentRepository
            .FindByCondition(s => s.Id == student.Id, false)
            .Include(s => s.User)
            .Include(s => s.Class)
            .Include(s => s.Parent)
                .ThenInclude(p => p!.User)
            .FirstOrDefaultAsync();

        return _mapper.Map<StudentDto>(createdStudent!);
    }

    public async Task UpdateStudentAsync(int id, StudentUpdateDto dto)
    {
        var student = await _repositoryManager.StudentRepository
            .FindByCondition(s => s.Id == id, true)
            .FirstOrDefaultAsync();

        if (student == null)
            throw new NotFoundException($"Student with id {id} not found");

        student.ClassId = dto.ClassId;
        student.ParentId = dto.ParentId;
        if (dto.DateOfBirth.HasValue)
            student.DateOfBirth = dto.DateOfBirth.Value.ToUniversalTime();
        student.Gender = dto.Gender;
        student.Address = dto.Address;
        student.UpdatedAt = DateTime.UtcNow;

        _repositoryManager.StudentRepository.Update(student);
        await _repositoryManager.SaveAsync();
    }

    public async Task DeleteStudentAsync(int id)
    {
        var student = await _repositoryManager.StudentRepository
            .FindByCondition(s => s.Id == id, true)
            .FirstOrDefaultAsync();

        if (student == null)
            throw new NotFoundException($"Student with id {id} not found");

        _repositoryManager.StudentRepository.Delete(student);
        await _repositoryManager.SaveAsync();
    }

    public async Task<IEnumerable<StudentDto>> GetStudentsByClassIdAsync(int classId, bool trackChanges)
    {
        var students = await _repositoryManager.StudentRepository
            .FindByCondition(s => s.ClassId == classId, trackChanges)
            .Include(s => s.User)
            .ToListAsync();

        return _mapper.Map<IEnumerable<StudentDto>>(students);
    }

    public async Task<IEnumerable<InvoiceResponseDto>> GetMyInvoicesAsync(int userId, bool trackChanges)
    {
        var student = await _repositoryManager.StudentRepository.GetByUserIdAsync(userId, trackChanges);
        if (student == null) return [];

        var studentFees = await _repositoryManager.StudentFeeRepository.GetByStudentAsync(student.Id, trackChanges);
        return _mapper.Map<IEnumerable<InvoiceResponseDto>>(studentFees);
    }
}