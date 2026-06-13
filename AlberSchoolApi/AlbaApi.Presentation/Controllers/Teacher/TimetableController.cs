using DTOs.Academics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Teacher;

[ApiController]
[Route("api/teacher/timetable")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireTeacher")]
public class TimetableController : ControllerBase
{
    private readonly IServiceManager _serviceManager;

    public TimetableController(IServiceManager serviceManager)
    {
        _serviceManager = serviceManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyTimetable()
    {
        var userId = User.GetUserId();
        var teacher = await _serviceManager.TeacherService.GetByUserIdAsync(userId, false);
        if (teacher == null) 
            return NotFound(new { message = "Teacher profile not found." });

        var entries = await _serviceManager.TimetableEntryService.GetByTeacherAsync(teacher.Id, false);
        return Ok(entries);
    }
}
