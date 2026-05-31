using Contracts.Repositories;
using DTOs.Academics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AlbaApi.Presentation.Controllers.Student;

[ApiController]
[Route("api/student/timetable")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireStudent")]
public class TimetableController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMyTimetable([FromServices] IRepositoryManager repo)
    {
        var userId = User.GetUserId();
        var student = await repo.StudentRepository.GetByUserIdAsync(userId, false);
        if (student == null) return NotFound(new { message = "Student profile not found." });

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
