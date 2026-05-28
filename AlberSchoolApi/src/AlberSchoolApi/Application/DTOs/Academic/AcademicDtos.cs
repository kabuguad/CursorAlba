using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Application.DTOs.Academic;

// ── Academic Year & Term ──────────────────────────────────────────────────

public record AcademicYearDto(int Id, string Name, DateOnly StartDate, DateOnly EndDate, bool IsCurrent, YearStatus Status, IEnumerable<TermDto> Terms);
public record TermDto(int Id, string Name, DateOnly StartDate, DateOnly EndDate, bool IsCurrent, TermStatus Status);
public record CreateAcademicYearRequest(string Name, DateOnly StartDate, DateOnly EndDate);
public record CreateTermRequest(int AcademicYearId, string Name, DateOnly StartDate, DateOnly EndDate);

// ── Classes ───────────────────────────────────────────────────────────────

public record SchoolClassDto(int Id, string Name, string Grade, string? Stream, int? ClassTeacherId, string? ClassTeacherName, int AcademicYearId, int Capacity, int EnrolledCount);
public record CreateClassRequest(string Name, string Grade, string? Stream, int? ClassTeacherId, int AcademicYearId, int Capacity = 45);
public record UpdateClassRequest(string Name, string? Stream, int? ClassTeacherId, int Capacity);

// ── Subjects ──────────────────────────────────────────────────────────────

public record SubjectDto(int Id, string Code, string Name, string? Description, bool IsCompulsory, string? GradeLevel);
public record CreateSubjectRequest(string Code, string Name, string? Description, bool IsCompulsory, string? GradeLevel);
public record UpdateSubjectRequest(string Name, string? Description, bool IsCompulsory, string? GradeLevel);

// ── Enrollments ───────────────────────────────────────────────────────────

public record EnrollmentDto(int Id, int StudentId, string StudentName, string AdmNo, int ClassId, string ClassName, EnrollmentStatus Status, DateOnly EnrolledDate);
public record BulkEnrollRequest(int ClassId, int AcademicYearId, IEnumerable<int> StudentIds);

// ── Exams ─────────────────────────────────────────────────────────────────

public record ExamDto(int Id, string Name, int TermId, string TermName, DateOnly? StartDate, DateOnly? EndDate, ExamStatus Status, IEnumerable<string> TargetGrades);
public record CreateExamRequest(string Name, int TermId, DateOnly? StartDate, DateOnly? EndDate, IEnumerable<string> TargetGrades);
public record UpdateExamRequest(string Name, DateOnly? StartDate, DateOnly? EndDate, ExamStatus Status, IEnumerable<string> TargetGrades);

// ── Results ───────────────────────────────────────────────────────────────

public record StudentResultDto(int Id, int StudentId, string StudentName, string AdmNo, int SubjectId, string SubjectName, decimal? Score, string? Grade, int? Points, string? Band, string? TeacherRemarks);
public record UpsertResultRequest(int StudentId, int SubjectId, decimal? Score, string? TeacherRemarks);
public record BulkUpsertResultsRequest(int ExamId, IEnumerable<UpsertResultRequest> Results);

// ── Timetable ─────────────────────────────────────────────────────────────

public record TimetableSlotDto(int Id, int ClassId, string ClassName, int SubjectId, string SubjectName, int TeacherId, string TeacherName, int DayOfWeek, TimeOnly StartTime, TimeOnly EndTime, string? Room);
public record CreateTimetableSlotRequest(int ClassId, int SubjectId, int TeacherId, int DayOfWeek, TimeOnly StartTime, TimeOnly EndTime, string? Room, int AcademicYearId);

// ── Attendance ────────────────────────────────────────────────────────────

public record AttendanceDto(int Id, int StudentId, string StudentName, DateOnly Date, AttendanceStatus Status, string? Notes);
public record BulkAttendanceRequest(int ClassId, DateOnly Date, IEnumerable<StudentAttendanceItem> Records);
public record StudentAttendanceItem(int StudentId, AttendanceStatus Status, string? Notes);

// ── Assessment Schemes ────────────────────────────────────────────────────

public record AssessmentSchemeDto(int Id, string Name, bool IsDefault, IEnumerable<BandDto> Bands);
public record BandDto(int Id, string Label, decimal MinScore, decimal MaxScore, int? Points, int SortOrder);
public record CreateSchemeRequest(string Name, bool IsDefault, IEnumerable<CreateBandRequest> Bands);
public record CreateBandRequest(string Label, decimal MinScore, decimal MaxScore, int? Points, int SortOrder = 0);

// ── Homework ──────────────────────────────────────────────────────────────

public record HomeworkDto(int Id, int ClassId, string ClassName, int SubjectId, string SubjectName, int TeacherId, string TeacherName, string Title, string? Description, DateOnly DueDate, string? AttachmentUrl, DateTime CreatedAt);
public record CreateHomeworkRequest(int ClassId, int SubjectId, string Title, string? Description, DateOnly DueDate, string? AttachmentUrl);
