using DTOs.Attendance;
using Entities.Models.Attendance;

namespace Service.Contracts;

public interface IAttendanceService
{
    Task<IEnumerable<AttendanceRecord>> GetAttendanceForStudentAsync(int studentId, DateTime from, DateTime to, bool trackChanges);
    Task<IEnumerable<AttendanceRecord>> GetAttendanceForClassAsync(int classId, DateTime date, bool trackChanges);
    Task MarkAttendanceAsync(AttendanceMarkDto dto);
}
