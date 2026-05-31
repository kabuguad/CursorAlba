using AutoMapper;
using Contracts.Repositories;
using DTOs.Attendance;
using Entities.Models.Attendance;
using Service.Contracts;
using Microsoft.EntityFrameworkCore;

namespace Service;

public class AttendanceService : IAttendanceService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public AttendanceService(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<IEnumerable<AttendanceRecord>> GetAttendanceForStudentAsync(int studentId, DateTime from, DateTime to, bool trackChanges)
    {
        return await _repositoryManager.AttendanceRepository.GetByStudentAsync(studentId, from, to, trackChanges);
    }

    public async Task<IEnumerable<AttendanceRecord>> GetAttendanceForClassAsync(int classId, DateTime date, bool trackChanges)
    {
        return await _repositoryManager.AttendanceRepository.GetByClassAndDateAsync(classId, date, trackChanges);
    }

    public async Task MarkAttendanceAsync(AttendanceMarkDto dto)
    {
        var existing = await _repositoryManager.AttendanceRepository.GetForStudentDateAsync(dto.StudentId, dto.Date);
        if (existing != null)
        {
            existing.Status = (Entities.Models.Attendance.AttendanceStatus)dto.Status;
            existing.Remarks = dto.Remarks;
            _repositoryManager.AttendanceRepository.Update(existing);
        }
        else
        {
            var record = new AttendanceRecord
            {
                StudentId = dto.StudentId,
                Date = dto.Date,
                Status = (Entities.Models.Attendance.AttendanceStatus)dto.Status,
                Remarks = dto.Remarks
            };
            _repositoryManager.AttendanceRepository.Create(record);
        }

        await _repositoryManager.SaveAsync();
    }
}
