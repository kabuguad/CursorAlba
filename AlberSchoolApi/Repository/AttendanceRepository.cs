using Microsoft.EntityFrameworkCore;
using Contracts.Repositories;
using Repository;
using Entities.Models.Attendance;

namespace Repository;

public class AttendanceRepository : RepositoryBase<AttendanceRecord>, IAttendanceRepository
{
    public AttendanceRepository(RepositoryContext context) : base(context) { }

    public async Task<IEnumerable<AttendanceRecord>> GetByStudentAsync(int studentId, DateTime from, DateTime to, bool trackChanges) =>
        await FindByCondition(a => a.StudentId == studentId && a.Date >= from && a.Date <= to, trackChanges)
            .ToListAsync();

    public async Task<IEnumerable<AttendanceRecord>> GetByClassAndDateAsync(int classId, DateTime date, bool trackChanges) =>
        await Context.AttendanceRecords
            .Where(a => a.Student!.ClassId == classId && a.Date.Date == date.Date)
            .Include(a => a.Student)
            .ThenInclude(s => s!.User)
            .ToListAsync();

    public async Task<AttendanceRecord?> GetForStudentDateAsync(int studentId, DateTime date) =>
        await FindByCondition(a => a.StudentId == studentId && a.Date.Date == date.Date, false)
            .FirstOrDefaultAsync();
}
