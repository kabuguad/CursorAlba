using Entities.Models.Attendance;

namespace Contracts.Repositories;

public interface IAttendanceRepository : IRepositoryBase<AttendanceRecord>
{
    Task<IEnumerable<AttendanceRecord>> GetByStudentAsync(int studentId, DateTime from, DateTime to, bool trackChanges);
    Task<IEnumerable<AttendanceRecord>> GetByClassAndDateAsync(int classId, DateTime date, bool trackChanges);
    Task<AttendanceRecord?> GetForStudentDateAsync(int studentId, DateTime date);
}
