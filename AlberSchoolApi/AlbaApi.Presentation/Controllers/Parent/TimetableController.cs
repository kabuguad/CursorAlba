using DTOs.Academics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Parent;

[ApiController]
[Route("api/parent/children/{studentId:int}/timetable")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireParent")]
public class TimetableController : ControllerBase
{
    private readonly IServiceManager _serviceManager;

    public TimetableController(IServiceManager serviceManager)
    {
        _serviceManager = serviceManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetChildTimetable(int studentId)
    {
        var student = await _serviceManager.StudentService.GetWithDetailsAsync(studentId, false);
        if (student == null) 
            return NotFound(new { message = "Student not found." });

        var entries = await _serviceManager.TimetableEntryService.GetByClassAsync(student.ClassId, false);
        return Ok(entries);
    }
}