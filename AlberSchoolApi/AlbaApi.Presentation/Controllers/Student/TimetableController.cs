using DTOs.Academics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Student;

[ApiController]
[Route("api/student/timetable")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireStudent")]
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
        var student = await _serviceManager.StudentService.GetByUserIdAsync(userId, false);
        if (student == null) 
            return NotFound(new { message = "Student profile not found." });

        var entries = await _serviceManager.TimetableEntryService.GetByClassAsync(student.ClassId, false);
        return Ok(entries);
    }
}