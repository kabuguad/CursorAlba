using Contracts.Repositories;
using DTOs.Academics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AlbaApi.Presentation.Controllers.Parent;

[ApiController]
[Route("api/parent/children/{studentId:int}/timetable")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireParent")]
public class TimetableController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetChildTimetable(int studentId, [FromServices] IRepositoryManager repo)
    {
        var student = await repo.StudentRepository.GetWithDetailsAsync(studentId, false);
        if (student == null) return NotFound(new { message = "Student not found." });

        var entries = await repo.TimetableRepository.GetByClassAsync(student.ClassId, false);
        var result = entries.Select(e => new TimetableEntryDto
        {
            Id = e.Id,
            DayOfWeek = e.DayOfWeek.ToString(),
            StartTime = e.StartTime.ToString(@"hh\:mm"),
            EndTime = e.EndTime.ToString(@"hh\:mm"),
            SubjectName = e.Subject?.Name ?? "Unknown",
            SubjectCode = e.Subject?.Code,
            TeacherName = e.Teacher?.User != null ? e.Teacher.User.FullName : "TBA",
            ClassId = e.ClassId,
        });

        return Ok(result);
    }
}
