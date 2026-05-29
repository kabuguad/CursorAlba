using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.DTOs.Academic;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.Academic;
using AlberSchoolApi.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlberSchoolApi.Presentation.Controllers;

[ApiController]
[Route("api/academic")]
[Authorize]
public class AcademicController : ControllerBase
{
    private readonly IAcademicYearRepository _years;
    private readonly ITermRepository _terms;
    private readonly ISchoolClassRepository _classes;
    private readonly ISubjectRepository _subjects;
    private readonly IExamRepository _exams;
    private readonly IStudentResultRepository _results;
    private readonly IAttendanceRepository _attendance;
    private readonly ITimetableRepository _timetable;

    public AcademicController(
        IAcademicYearRepository years, ITermRepository terms,
        ISchoolClassRepository classes, ISubjectRepository subjects,
        IExamRepository exams, IStudentResultRepository results,
        IAttendanceRepository attendance, ITimetableRepository timetable)
    {
        _years = years; _terms = terms; _classes = classes; _subjects = subjects;
        _exams = exams; _results = results; _attendance = attendance; _timetable = timetable;
    }

    // ── Academic Years ────────────────────────────────────────────────────

    [HttpGet("years")]
    public async Task<ActionResult<ApiResponse<IEnumerable<AcademicYearDto>>>> GetYears(CancellationToken ct)
    {
        var years = await _years.GetAllAsync(ct);
        var dtos = new List<AcademicYearDto>();
        foreach (var y in years)
        {
            var terms = await _terms.GetByYearAsync(y.Id, ct);
            dtos.Add(new AcademicYearDto(y.Id, y.Name, y.StartDate, y.EndDate, y.IsCurrent, y.Status, terms.Select(t => new TermDto(t.Id, t.Name, t.StartDate, t.EndDate, t.IsCurrent, t.Status))));
        }
        return Ok(ApiResponse<IEnumerable<AcademicYearDto>>.Ok(dtos));
    }

    [HttpPost("years")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<AcademicYearDto>>> CreateYear([FromBody] CreateAcademicYearRequest req, CancellationToken ct)
    {
        var year = new AcademicYear { Name = req.Name, StartDate = req.StartDate, EndDate = req.EndDate };
        await _years.AddAsync(year, ct);
        await _years.SaveChangesAsync(ct);
        return Ok(ApiResponse<AcademicYearDto>.Ok(new AcademicYearDto(year.Id, year.Name, year.StartDate, year.EndDate, year.IsCurrent, year.Status, []), "Academic year created."));
    }

    [HttpPost("years/{id:int}/set-current")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> SetCurrentYear(int id, CancellationToken ct)
    {
        await _years.SetCurrentAsync(id, ct);
        return Ok(ApiResponse.Ok("Current academic year updated."));
    }

    // ── Terms ─────────────────────────────────────────────────────────────

    [HttpGet("terms/{yearId:int}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<TermDto>>>> GetTerms(int yearId, CancellationToken ct)
    {
        var terms = await _terms.GetByYearAsync(yearId, ct);
        return Ok(ApiResponse<IEnumerable<TermDto>>.Ok(terms.Select(t => new TermDto(t.Id, t.Name, t.StartDate, t.EndDate, t.IsCurrent, t.Status))));
    }

    [HttpPost("terms")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<TermDto>>> CreateTerm([FromBody] CreateTermRequest req, CancellationToken ct)
    {
        var term = new Term { AcademicYearId = req.AcademicYearId, Name = req.Name, StartDate = req.StartDate, EndDate = req.EndDate };
        await _terms.AddAsync(term, ct);
        await _terms.SaveChangesAsync(ct);
        return Ok(ApiResponse<TermDto>.Ok(new TermDto(term.Id, term.Name, term.StartDate, term.EndDate, term.IsCurrent, term.Status), "Term created."));
    }

    // ── Classes ───────────────────────────────────────────────────────────

    [HttpGet("classes")]
    public async Task<ActionResult<ApiResponse<IEnumerable<SchoolClassDto>>>> GetClasses([FromQuery] int? yearId, CancellationToken ct)
    {
        IEnumerable<SchoolClass> classes;
        if (yearId.HasValue) classes = await _classes.GetByYearAsync(yearId.Value, ct);
        else classes = await _classes.GetAllAsync(ct);
        return Ok(ApiResponse<IEnumerable<SchoolClassDto>>.Ok(classes.Select(c => new SchoolClassDto(c.Id, c.Name, c.Grade, c.Stream, c.ClassTeacherId, c.ClassTeacher != null ? $"{c.ClassTeacher.FirstName} {c.ClassTeacher.LastName}" : null, c.AcademicYearId, c.Capacity, c.Enrollments.Count(e => e.Status == EnrollmentStatus.Active)))));
    }

    [HttpGet("classes/{id:int}")]
    public async Task<ActionResult<ApiResponse<SchoolClassDto>>> GetClass(int id, CancellationToken ct)
    {
        var c = await _classes.GetWithEnrollmentsAsync(id, ct);
        if (c is null) return NotFound(ApiResponse<SchoolClassDto>.Fail("Class not found."));
        return Ok(ApiResponse<SchoolClassDto>.Ok(new SchoolClassDto(c.Id, c.Name, c.Grade, c.Stream, c.ClassTeacherId, null, c.AcademicYearId, c.Capacity, c.Enrollments.Count(e => e.Status == EnrollmentStatus.Active))));
    }

    [HttpPost("classes")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<SchoolClassDto>>> CreateClass([FromBody] CreateClassRequest req, CancellationToken ct)
    {
        var c = new SchoolClass { Name = req.Name, Grade = req.Grade, Stream = req.Stream, ClassTeacherId = req.ClassTeacherId, AcademicYearId = req.AcademicYearId, Capacity = req.Capacity };
        await _classes.AddAsync(c, ct);
        await _classes.SaveChangesAsync(ct);
        return Ok(ApiResponse<SchoolClassDto>.Ok(new SchoolClassDto(c.Id, c.Name, c.Grade, c.Stream, c.ClassTeacherId, null, c.AcademicYearId, c.Capacity, 0), "Class created."));
    }

    // ── Subjects ──────────────────────────────────────────────────────────

    [HttpGet("subjects")]
    public async Task<ActionResult<ApiResponse<IEnumerable<SubjectDto>>>> GetSubjects([FromQuery] string? grade, CancellationToken ct)
    {
        var subjects = await _subjects.GetByGradeLevelAsync(grade, ct);
        return Ok(ApiResponse<IEnumerable<SubjectDto>>.Ok(subjects.Select(s => new SubjectDto(s.Id, s.Code, s.Name, s.Description, s.IsCompulsory, s.GradeLevel))));
    }

    [HttpPost("subjects")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<SubjectDto>>> CreateSubject([FromBody] CreateSubjectRequest req, CancellationToken ct)
    {
        if (await _subjects.ExistsAsync(s => s.Code == req.Code, ct))
            return Conflict(ApiResponse<SubjectDto>.Fail("Subject code already exists."));
        var s = new Subject { Code = req.Code, Name = req.Name, Description = req.Description, IsCompulsory = req.IsCompulsory, GradeLevel = req.GradeLevel };
        await _subjects.AddAsync(s, ct);
        await _subjects.SaveChangesAsync(ct);
        return Ok(ApiResponse<SubjectDto>.Ok(new SubjectDto(s.Id, s.Code, s.Name, s.Description, s.IsCompulsory, s.GradeLevel), "Subject created."));
    }

    // ── Exams ─────────────────────────────────────────────────────────────

    [HttpGet("exams")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ExamDto>>>> GetExams([FromQuery] int? termId, CancellationToken ct)
    {
        IEnumerable<Exam> exams;
        if (termId.HasValue) exams = await _exams.GetByTermAsync(termId.Value, ct);
        else exams = await _exams.GetAllAsync(ct);
        return Ok(ApiResponse<IEnumerable<ExamDto>>.Ok(exams.Select(e => new ExamDto(e.Id, e.Name, e.TermId, e.Term?.Name ?? "", e.StartDate, e.EndDate, e.Status, e.ExamGrades.Select(g => g.Grade)))));
    }

    [HttpPost("exams")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<ExamDto>>> CreateExam([FromBody] CreateExamRequest req, CancellationToken ct)
    {
        var exam = new Exam { Name = req.Name, TermId = req.TermId, StartDate = req.StartDate, EndDate = req.EndDate };
        foreach (var grade in req.TargetGrades) exam.ExamGrades.Add(new ExamGrade { Grade = grade });
        await _exams.AddAsync(exam, ct);
        await _exams.SaveChangesAsync(ct);
        return Ok(ApiResponse<ExamDto>.Ok(new ExamDto(exam.Id, exam.Name, exam.TermId, "", exam.StartDate, exam.EndDate, exam.Status, req.TargetGrades), "Exam created."));
    }

    // ── Results ───────────────────────────────────────────────────────────

    [HttpGet("results/{studentId:int}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<StudentResultDto>>>> GetStudentResults(int studentId, [FromQuery] int? examId, CancellationToken ct)
    {
        var results = await _results.GetByStudentAsync(studentId, examId, ct);
        return Ok(ApiResponse<IEnumerable<StudentResultDto>>.Ok(results.Select(r => new StudentResultDto(r.Id, r.StudentId, $"{r.Student?.FirstName} {r.Student?.LastName}", r.Student?.AdmNo ?? "", r.SubjectId, r.Subject?.Name ?? "", r.Score, r.Grade, r.Points, r.Band, r.TeacherRemarks))));
    }

    [HttpPost("results/bulk")]
    [Authorize(Roles = "Admin,Teacher")]
    public async Task<ActionResult<ApiResponse>> BulkUpsertResults([FromBody] BulkUpsertResultsRequest req, CancellationToken ct)
    {
        var userIdStr = User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        int.TryParse(userIdStr, out var userId);

        var entities = req.Results.Select(r => new StudentResult
        {
            StudentId = r.StudentId,
            ExamId = req.ExamId,
            SubjectId = r.SubjectId,
            Score = r.Score,
            TeacherRemarks = r.TeacherRemarks,
            RecordedBy = userId
        });
        await _results.BulkUpsertAsync(entities, ct);
        return Ok(ApiResponse.Ok("Results saved."));
    }

    // ── Attendance ────────────────────────────────────────────────────────

    [HttpGet("attendance/{studentId:int}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<AttendanceDto>>>> GetStudentAttendance(int studentId, [FromQuery] DateOnly? from, [FromQuery] DateOnly? to, CancellationToken ct)
    {
        var records = await _attendance.GetByStudentAsync(studentId, from, to, ct);
        return Ok(ApiResponse<IEnumerable<AttendanceDto>>.Ok(records.Select(a => new AttendanceDto(a.Id, a.StudentId, $"{a.Student?.FirstName} {a.Student?.LastName}", a.Date, a.Status, a.Notes))));
    }

    [HttpPost("attendance/bulk")]
    [Authorize(Roles = "Admin,Teacher")]
    public async Task<ActionResult<ApiResponse>> BulkAttendance([FromBody] BulkAttendanceRequest req, CancellationToken ct)
    {
        var userIdStr = User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        int.TryParse(userIdStr, out var userId);

        var records = req.Records.Select(r => new AttendanceRecord
        {
            StudentId = r.StudentId,
            ClassId = req.ClassId,
            Date = req.Date,
            Status = r.Status,
            Notes = r.Notes,
            RecordedBy = userId
        });
        await _attendance.BulkUpsertAsync(records, ct);
        return Ok(ApiResponse.Ok("Attendance recorded."));
    }

    // ── Timetable ─────────────────────────────────────────────────────────

    [HttpGet("timetable/class/{classId:int}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<TimetableSlotDto>>>> GetClassTimetable(int classId, [FromQuery] int yearId, CancellationToken ct)
    {
        var slots = await _timetable.GetByClassAsync(classId, yearId, ct);
        return Ok(ApiResponse<IEnumerable<TimetableSlotDto>>.Ok(slots.Select(MapSlotDto)));
    }

    [HttpGet("timetable/teacher/{teacherId:int}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<TimetableSlotDto>>>> GetTeacherTimetable(int teacherId, [FromQuery] int yearId, CancellationToken ct)
    {
        var slots = await _timetable.GetByTeacherAsync(teacherId, yearId, ct);
        return Ok(ApiResponse<IEnumerable<TimetableSlotDto>>.Ok(slots.Select(MapSlotDto)));
    }

    [HttpPost("timetable")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<TimetableSlotDto>>> CreateTimetableSlot([FromBody] CreateTimetableSlotRequest req, CancellationToken ct)
    {
        if (await _timetable.HasConflictAsync(req.TeacherId, req.DayOfWeek, req.StartTime, req.EndTime, req.AcademicYearId, ct: ct))
            return Conflict(ApiResponse<TimetableSlotDto>.Fail("Teacher has a conflicting slot at this time."));

        var slot = new TimetableSlot
        {
            ClassId = req.ClassId, SubjectId = req.SubjectId, TeacherId = req.TeacherId,
            DayOfWeek = req.DayOfWeek, StartTime = req.StartTime, EndTime = req.EndTime,
            Room = req.Room, AcademicYearId = req.AcademicYearId
        };
        await _timetable.AddAsync(slot, ct);
        await _timetable.SaveChangesAsync(ct);
        return Ok(ApiResponse<TimetableSlotDto>.Ok(MapSlotDto(slot), "Timetable slot created."));
    }

    [HttpDelete("timetable/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> DeleteTimetableSlot(int id, CancellationToken ct)
    {
        var slot = await _timetable.GetByIdAsync(id, ct);
        if (slot is null) return NotFound(ApiResponse.Fail("Timetable slot not found."));
        await _timetable.DeleteAsync(slot, ct);
        await _timetable.SaveChangesAsync(ct);
        return Ok(ApiResponse.Ok("Timetable slot deleted."));
    }

    private static TimetableSlotDto MapSlotDto(TimetableSlot t) => new(
        t.Id, t.ClassId, t.Class?.Name ?? "", t.SubjectId, t.Subject?.Name ?? "",
        t.TeacherId, t.Teacher != null ? $"{t.Teacher.FirstName} {t.Teacher.LastName}" : "",
        t.DayOfWeek, t.StartTime, t.EndTime, t.Room);
}
