using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.DTOs.Students;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.People;
using AlberSchoolApi.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlberSchoolApi.Presentation.Controllers;

[ApiController]
[Route("api/students")]
[Authorize]
public class StudentsController : ControllerBase
{
    private readonly IStudentRepository _students;

    public StudentsController(IStudentRepository students) => _students = students;

    /// <summary>Get a paginated, searchable list of students.</summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<StudentListDto>>>> GetAll(
        [FromQuery] string? search, [FromQuery] string? grade,
        [FromQuery] StudentStatus? status, [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _students.SearchAsync(search, grade, status, page, pageSize, ct);
        var dtos = result.Items.Select(MapToListDto);
        return Ok(ApiResponse<PagedResult<StudentListDto>>.Ok(new PagedResult<StudentListDto>
        {
            Items = dtos,
            TotalCount = result.TotalCount,
            Page = result.Page,
            PageSize = result.PageSize
        }));
    }

    /// <summary>Get a single student with full details.</summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<StudentDetailDto>>> GetById(int id, CancellationToken ct)
    {
        var student = await _students.GetWithDetailsAsync(id, ct);
        if (student is null) return NotFound(ApiResponse<StudentDetailDto>.Fail("Student not found."));
        return Ok(ApiResponse<StudentDetailDto>.Ok(MapToDetailDto(student)));
    }

    /// <summary>Create a new student.</summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<StudentDetailDto>>> Create([FromBody] CreateStudentRequest req, CancellationToken ct)
    {
        if (await _students.AdmNoExistsAsync(await _students.GenerateNextAdmNoAsync(ct), ct: ct))
            return Conflict(ApiResponse<StudentDetailDto>.Fail("Admission number already exists."));

        var admNo = await _students.GenerateNextAdmNoAsync(ct);
        var student = new Student
        {
            AdmNo = admNo,
            FirstName = req.FirstName,
            LastName = req.LastName,
            DateOfBirth = req.DateOfBirth,
            Gender = req.Gender,
            Address = req.Address,
            MedicalNotes = req.MedicalNotes,
            SpecialNeeds = req.SpecialNeeds,
            PreviousSchool = req.PreviousSchool,
            TransportRouteId = req.TransportRouteId,
            EnrolledDate = DateOnly.FromDateTime(DateTime.UtcNow)
        };

        if (req.PrimaryContact is not null)
        {
            student.EmergencyContacts.Add(new StudentEmergencyContact
            {
                Name = req.PrimaryContact.Name,
                Phone = req.PrimaryContact.Phone,
                Relation = req.PrimaryContact.Relation,
                IsPrimary = true
            });
        }

        await _students.AddAsync(student, ct);
        await _students.SaveChangesAsync(ct);

        var created = await _students.GetWithDetailsAsync(student.Id, ct);
        return CreatedAtAction(nameof(GetById), new { id = student.Id }, ApiResponse<StudentDetailDto>.Ok(MapToDetailDto(created!), "Student created."));
    }

    /// <summary>Update a student's profile information.</summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<StudentDetailDto>>> Update(int id, [FromBody] UpdateStudentRequest req, CancellationToken ct)
    {
        var student = await _students.GetByIdAsync(id, ct);
        if (student is null) return NotFound(ApiResponse<StudentDetailDto>.Fail("Student not found."));

        student.FirstName = req.FirstName;
        student.LastName = req.LastName;
        student.DateOfBirth = req.DateOfBirth;
        student.Gender = req.Gender;
        student.Address = req.Address;
        student.MedicalNotes = req.MedicalNotes;
        student.SpecialNeeds = req.SpecialNeeds;
        student.PreviousSchool = req.PreviousSchool;
        student.TransportRouteId = req.TransportRouteId;
        student.UpdatedAt = DateTime.UtcNow;

        await _students.UpdateAsync(student, ct);
        await _students.SaveChangesAsync(ct);

        var updated = await _students.GetWithDetailsAsync(id, ct);
        return Ok(ApiResponse<StudentDetailDto>.Ok(MapToDetailDto(updated!), "Student updated."));
    }

    /// <summary>Update a student's status.</summary>
    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> UpdateStatus(int id, [FromBody] UpdateStudentStatusRequest req, CancellationToken ct)
    {
        if (!await _students.ExistsAsync(s => s.Id == id, ct))
            return NotFound(ApiResponse.Fail("Student not found."));
        await _students.UpdateStatusAsync(id, req.Status, ct);
        return Ok(ApiResponse.Ok("Student status updated."));
    }

    /// <summary>Soft-delete a student record.</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> Delete(int id, CancellationToken ct)
    {
        if (!await _students.ExistsAsync(s => s.Id == id, ct))
            return NotFound(ApiResponse.Fail("Student not found."));
        await _students.SoftDeleteAsync(id, ct);
        return Ok(ApiResponse.Ok("Student deleted."));
    }

    /// <summary>Get summary stats (counts by grade, status).</summary>
    [HttpGet("stats")]
    public async Task<ActionResult<ApiResponse<StudentStatsDto>>> GetStats(CancellationToken ct)
    {
        var byGrade = await _students.GetCountsByGradeAsync(ct);
        var active = await _students.GetActiveCountAsync(ct);
        var total = await _students.CountAsync(ct: ct);
        var graduated = await _students.CountAsync(s => s.Status == StudentStatus.Graduated, ct);
        var suspended = await _students.CountAsync(s => s.Status == StudentStatus.Suspended, ct);
        return Ok(ApiResponse<StudentStatsDto>.Ok(new StudentStatsDto(total, active, graduated, suspended, byGrade)));
    }

    // ── Mapping helpers ────────────────────────────────────────────────────

    private static StudentListDto MapToListDto(Student s) => new(
        s.Id, s.AdmNo, s.FirstName, s.LastName, $"{s.FirstName} {s.LastName}",
        s.Enrollments.FirstOrDefault()?.Class?.Grade,
        s.Gender, s.Status, s.Photo,
        s.EmergencyContacts.FirstOrDefault(c => c.IsPrimary) is { } ec
            ? new EmergencyContactDto(ec.Id, ec.Name, ec.Phone, ec.Relation, ec.IsPrimary) : null
    );

    private static StudentDetailDto MapToDetailDto(Student s) => new(
        s.Id, s.AdmNo, s.FirstName, s.LastName, s.DateOfBirth, s.Gender, s.Photo,
        s.Address, s.MedicalNotes, s.SpecialNeeds, s.PreviousSchool, s.Status, s.EnrolledDate,
        s.TransportRouteId, s.TransportRoute?.Name,
        s.EmergencyContacts.Select(ec => new EmergencyContactDto(ec.Id, ec.Name, ec.Phone, ec.Relation, ec.IsPrimary)),
        s.CreatedAt
    );
}
