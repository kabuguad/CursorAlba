using Contracts.Repositories;
using DTOs.Academics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AlbaApi.Presentation.Controllers.Teacher;

[ApiController]
[Route("api/teacher/timetable")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireTeacher")]
public class TimetableController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMyTimetable([FromServices] IRepositoryManager repo)
    {
        var userId = User.GetUserId();
        var teacher = await repo.TeacherRepository.GetByUserIdAsync(userId, false);
        if (teacher == null) return NotFound(new { message = "Teacher profile not found." });

        var entries = await repo.TimetableRepository.GetByTeacherAsync(teacher.Id, false);
        var result = entries.Select(e => new TimetableEntryDto
        {
            Id = e.Id,
            DayOfWeek = e.DayOfWeek.ToString(),
            StartTime = e.StartTime.ToString(@"hh\:mm"),
            EndTime = e.EndTime.ToString(@"hh\:mm"),
            SubjectName = e.Subject?.Name ?? "Unknown",
            SubjectCode = e.Subject?.Code,
            TeacherName = teacher.User?.FullName ?? "TBA",
            ClassId = e.ClassId,
            ClassName = e.Class != null ? $"{e.Class.Name} {e.Class.Section}".Trim() : "Unknown",
        });

        return Ok(result);
    }
}
