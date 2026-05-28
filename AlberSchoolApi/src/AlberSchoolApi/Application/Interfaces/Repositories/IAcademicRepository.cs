using AlberSchoolApi.Domain.Entities.Academic;

namespace AlberSchoolApi.Application.Interfaces.Repositories;

public interface IAcademicYearRepository : IBaseRepository<AcademicYear>
{
    Task<AcademicYear?> GetCurrentAsync(CancellationToken ct = default);
    Task<AcademicYear?> GetWithTermsAsync(int id, CancellationToken ct = default);
    Task SetCurrentAsync(int id, CancellationToken ct = default);
}

public interface ITermRepository : IBaseRepository<Term>
{
    Task<Term?> GetCurrentAsync(CancellationToken ct = default);
    Task<IEnumerable<Term>> GetByYearAsync(int academicYearId, CancellationToken ct = default);
}

public interface ISchoolClassRepository : IBaseRepository<SchoolClass>
{
    Task<SchoolClass?> GetWithSubjectsAsync(int id, CancellationToken ct = default);
    Task<SchoolClass?> GetWithEnrollmentsAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<SchoolClass>> GetByYearAsync(int academicYearId, CancellationToken ct = default);
    Task<IEnumerable<SchoolClass>> GetByGradeAsync(string grade, CancellationToken ct = default);
}

public interface ISubjectRepository : IBaseRepository<Subject>
{
    Task<Subject?> GetByCodeAsync(string code, CancellationToken ct = default);
    Task<IEnumerable<Subject>> GetByGradeLevelAsync(string? grade, CancellationToken ct = default);
}

public interface IExamRepository : IBaseRepository<Exam>
{
    Task<Exam?> GetWithResultsAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<Exam>> GetByTermAsync(int termId, CancellationToken ct = default);
}

public interface IStudentResultRepository : IBaseRepository<StudentResult>
{
    Task<IEnumerable<StudentResult>> GetByStudentAsync(int studentId, int? examId = null, CancellationToken ct = default);
    Task<IEnumerable<StudentResult>> GetByExamAsync(int examId, CancellationToken ct = default);
    Task<IEnumerable<StudentResult>> GetByExamAndClassAsync(int examId, int classId, CancellationToken ct = default);
    Task BulkUpsertAsync(IEnumerable<StudentResult> results, CancellationToken ct = default);
}

public interface IAttendanceRepository : IBaseRepository<AttendanceRecord>
{
    Task<IEnumerable<AttendanceRecord>> GetByStudentAsync(int studentId, DateOnly? from = null, DateOnly? to = null, CancellationToken ct = default);
    Task<IEnumerable<AttendanceRecord>> GetByClassAndDateAsync(int classId, DateOnly date, CancellationToken ct = default);
    Task BulkUpsertAsync(IEnumerable<AttendanceRecord> records, CancellationToken ct = default);
}

public interface ILeaveRequestRepository : IBaseRepository<LeaveRequest>
{
    Task<IEnumerable<LeaveRequest>> GetByStaffAsync(int staffMemberId, CancellationToken ct = default);
    Task<IEnumerable<LeaveRequest>> GetPendingAsync(CancellationToken ct = default);
}

public interface ITimetableRepository : IBaseRepository<TimetableSlot>
{
    Task<IEnumerable<TimetableSlot>> GetByClassAsync(int classId, int academicYearId, CancellationToken ct = default);
    Task<IEnumerable<TimetableSlot>> GetByTeacherAsync(int teacherId, int academicYearId, CancellationToken ct = default);
    Task<bool> HasConflictAsync(int teacherId, int dayOfWeek, TimeOnly start, TimeOnly end, int academicYearId, int? excludeId = null, CancellationToken ct = default);
}
