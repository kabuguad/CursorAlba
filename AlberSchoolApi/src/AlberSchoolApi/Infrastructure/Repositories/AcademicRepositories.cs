using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.Academic;
using AlberSchoolApi.Domain.Enums;
using AlberSchoolApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AlberSchoolApi.Infrastructure.Repositories;

public class AcademicYearRepository : BaseRepository<AcademicYear>, IAcademicYearRepository
{
    public AcademicYearRepository(AppDbContext db) : base(db) { }
    public async Task<AcademicYear?> GetCurrentAsync(CancellationToken ct = default) => await _set.FirstOrDefaultAsync(y => y.IsCurrent, ct);
    public async Task<AcademicYear?> GetWithTermsAsync(int id, CancellationToken ct = default) => await _set.Include(y => y.Terms).FirstOrDefaultAsync(y => y.Id == id, ct);
    public async Task SetCurrentAsync(int id, CancellationToken ct = default)
    {
        await _set.ExecuteUpdateAsync(s => s.SetProperty(y => y.IsCurrent, false), ct);
        await _set.Where(y => y.Id == id).ExecuteUpdateAsync(s => s.SetProperty(y => y.IsCurrent, true), ct);
    }
}

public class TermRepository : BaseRepository<Term>, ITermRepository
{
    public TermRepository(AppDbContext db) : base(db) { }
    public async Task<Term?> GetCurrentAsync(CancellationToken ct = default) => await _set.FirstOrDefaultAsync(t => t.IsCurrent, ct);
    public async Task<IEnumerable<Term>> GetByYearAsync(int academicYearId, CancellationToken ct = default) => await _set.AsNoTracking().Where(t => t.AcademicYearId == academicYearId).OrderBy(t => t.StartDate).ToListAsync(ct);
}

public class SchoolClassRepository : BaseRepository<SchoolClass>, ISchoolClassRepository
{
    public SchoolClassRepository(AppDbContext db) : base(db) { }
    public async Task<SchoolClass?> GetWithSubjectsAsync(int id, CancellationToken ct = default) => await _set.Include(c => c.ClassSubjects).ThenInclude(cs => cs.Subject).Include(c => c.ClassTeacher).FirstOrDefaultAsync(c => c.Id == id, ct);
    public async Task<SchoolClass?> GetWithEnrollmentsAsync(int id, CancellationToken ct = default) => await _set.Include(c => c.Enrollments).ThenInclude(e => e.Student).FirstOrDefaultAsync(c => c.Id == id, ct);
    public async Task<IEnumerable<SchoolClass>> GetByYearAsync(int academicYearId, CancellationToken ct = default) => await _set.AsNoTracking().Where(c => c.AcademicYearId == academicYearId).OrderBy(c => c.Grade).ThenBy(c => c.Stream).ToListAsync(ct);
    public async Task<IEnumerable<SchoolClass>> GetByGradeAsync(string grade, CancellationToken ct = default) => await _set.AsNoTracking().Where(c => c.Grade == grade).ToListAsync(ct);
}

public class SubjectRepository : BaseRepository<Subject>, ISubjectRepository
{
    public SubjectRepository(AppDbContext db) : base(db) { }
    public async Task<Subject?> GetByCodeAsync(string code, CancellationToken ct = default) => await _set.FirstOrDefaultAsync(s => s.Code == code, ct);
    public async Task<IEnumerable<Subject>> GetByGradeLevelAsync(string? grade, CancellationToken ct = default) => await _set.AsNoTracking().Where(s => s.GradeLevel == null || s.GradeLevel == grade).ToListAsync(ct);
}

public class ExamRepository : BaseRepository<Exam>, IExamRepository
{
    public ExamRepository(AppDbContext db) : base(db) { }
    public async Task<Exam?> GetWithResultsAsync(int id, CancellationToken ct = default) => await _set.Include(e => e.Results).Include(e => e.ExamGrades).FirstOrDefaultAsync(e => e.Id == id, ct);
    public async Task<IEnumerable<Exam>> GetByTermAsync(int termId, CancellationToken ct = default) => await _set.AsNoTracking().Include(e => e.ExamGrades).Where(e => e.TermId == termId).ToListAsync(ct);
}

public class StudentResultRepository : BaseRepository<StudentResult>, IStudentResultRepository
{
    public StudentResultRepository(AppDbContext db) : base(db) { }
    public async Task<IEnumerable<StudentResult>> GetByStudentAsync(int studentId, int? examId = null, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking().Include(r => r.Subject).Include(r => r.Exam).Where(r => r.StudentId == studentId);
        if (examId.HasValue) q = q.Where(r => r.ExamId == examId.Value);
        return await q.ToListAsync(ct);
    }
    public async Task<IEnumerable<StudentResult>> GetByExamAsync(int examId, CancellationToken ct = default) => await _set.AsNoTracking().Include(r => r.Student).Include(r => r.Subject).Where(r => r.ExamId == examId).ToListAsync(ct);
    public async Task<IEnumerable<StudentResult>> GetByExamAndClassAsync(int examId, int classId, CancellationToken ct = default) => await _set.AsNoTracking().Include(r => r.Student).Include(r => r.Subject).Where(r => r.ExamId == examId && r.Student.Enrollments.Any(e => e.ClassId == classId)).ToListAsync(ct);
    public async Task BulkUpsertAsync(IEnumerable<StudentResult> results, CancellationToken ct = default)
    {
        foreach (var result in results)
        {
            var existing = await _set.FirstOrDefaultAsync(r => r.StudentId == result.StudentId && r.ExamId == result.ExamId && r.SubjectId == result.SubjectId, ct);
            if (existing is not null) { existing.Score = result.Score; existing.TeacherRemarks = result.TeacherRemarks; _set.Update(existing); }
            else await _set.AddAsync(result, ct);
        }
        await _db.SaveChangesAsync(ct);
    }
}

public class AttendanceRepository : BaseRepository<AttendanceRecord>, IAttendanceRepository
{
    public AttendanceRepository(AppDbContext db) : base(db) { }
    public async Task<IEnumerable<AttendanceRecord>> GetByStudentAsync(int studentId, DateOnly? from = null, DateOnly? to = null, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking().Where(a => a.StudentId == studentId);
        if (from.HasValue) q = q.Where(a => a.Date >= from.Value);
        if (to.HasValue) q = q.Where(a => a.Date <= to.Value);
        return await q.OrderByDescending(a => a.Date).ToListAsync(ct);
    }
    public async Task<IEnumerable<AttendanceRecord>> GetByClassAndDateAsync(int classId, DateOnly date, CancellationToken ct = default) => await _set.AsNoTracking().Include(a => a.Student).Where(a => a.ClassId == classId && a.Date == date).ToListAsync(ct);
    public async Task BulkUpsertAsync(IEnumerable<AttendanceRecord> records, CancellationToken ct = default)
    {
        foreach (var record in records)
        {
            var existing = await _set.FirstOrDefaultAsync(a => a.StudentId == record.StudentId && a.Date == record.Date, ct);
            if (existing is not null) { existing.Status = record.Status; existing.Notes = record.Notes; _set.Update(existing); }
            else await _set.AddAsync(record, ct);
        }
        await _db.SaveChangesAsync(ct);
    }
}

public class LeaveRequestRepository : BaseRepository<LeaveRequest>, ILeaveRequestRepository
{
    public LeaveRequestRepository(AppDbContext db) : base(db) { }
    public async Task<IEnumerable<LeaveRequest>> GetByStaffAsync(int staffMemberId, CancellationToken ct = default) => await _set.AsNoTracking().Where(l => l.StaffMemberId == staffMemberId).OrderByDescending(l => l.SubmittedAt).ToListAsync(ct);
    public async Task<IEnumerable<LeaveRequest>> GetPendingAsync(CancellationToken ct = default) => await _set.AsNoTracking().Include(l => l.StaffMember).Where(l => l.Status == LeaveStatus.Pending).OrderByDescending(l => l.SubmittedAt).ToListAsync(ct);
}

public class TimetableRepository : BaseRepository<TimetableSlot>, ITimetableRepository
{
    public TimetableRepository(AppDbContext db) : base(db) { }
    public async Task<IEnumerable<TimetableSlot>> GetByClassAsync(int classId, int academicYearId, CancellationToken ct = default) => await _set.AsNoTracking().Include(t => t.Subject).Include(t => t.Teacher).Where(t => t.ClassId == classId && t.AcademicYearId == academicYearId).OrderBy(t => t.DayOfWeek).ThenBy(t => t.StartTime).ToListAsync(ct);
    public async Task<IEnumerable<TimetableSlot>> GetByTeacherAsync(int teacherId, int academicYearId, CancellationToken ct = default) => await _set.AsNoTracking().Include(t => t.Class).Include(t => t.Subject).Where(t => t.TeacherId == teacherId && t.AcademicYearId == academicYearId).OrderBy(t => t.DayOfWeek).ThenBy(t => t.StartTime).ToListAsync(ct);
    public async Task<bool> HasConflictAsync(int teacherId, int dayOfWeek, TimeOnly start, TimeOnly end, int academicYearId, int? excludeId = null, CancellationToken ct = default) => await _set.AnyAsync(t => t.TeacherId == teacherId && t.DayOfWeek == dayOfWeek && t.AcademicYearId == academicYearId && (excludeId == null || t.Id != excludeId) && t.StartTime < end && t.EndTime > start, ct);
}

public class MeetingSlotRepository : BaseRepository<MeetingSlot>, IMeetingSlotRepository
{
    public MeetingSlotRepository(AppDbContext db) : base(db) { }
    public async Task<IEnumerable<MeetingSlot>> GetByTeacherAsync(int teacherId, DateOnly? from = null, DateOnly? to = null, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking().Include(m => m.BookedByUser).Include(m => m.Student).Where(m => m.TeacherId == teacherId);
        if (from.HasValue) q = q.Where(m => m.MeetingDate >= from.Value);
        if (to.HasValue) q = q.Where(m => m.MeetingDate <= to.Value);
        return await q.OrderBy(m => m.MeetingDate).ThenBy(m => m.StartTime).ToListAsync(ct);
    }
    public async Task<IEnumerable<MeetingSlot>> GetAvailableAsync(int teacherId, CancellationToken ct = default) => await _set.AsNoTracking().Where(m => m.TeacherId == teacherId && m.Status == Domain.Enums.MeetingSlotStatus.Available && m.MeetingDate >= DateOnly.FromDateTime(DateTime.UtcNow)).OrderBy(m => m.MeetingDate).ToListAsync(ct);
    public async Task<bool> HasOverlapAsync(int teacherId, DateOnly date, TimeOnly start, TimeOnly end, int? excludeId = null, CancellationToken ct = default) => await _set.AnyAsync(m => m.TeacherId == teacherId && m.MeetingDate == date && (excludeId == null || m.Id != excludeId) && m.StartTime < end && m.EndTime > start, ct);
}
