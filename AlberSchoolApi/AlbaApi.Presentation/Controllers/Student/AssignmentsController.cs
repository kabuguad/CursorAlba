using DTOs.Academics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Student;

[ApiController]
[Route("api/student/assignments")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireStudent")]
public class AssignmentsController : ControllerBase
{
    private readonly IServiceManager _serviceManager;

    public AssignmentsController(IServiceManager serviceManager)
    {
        _serviceManager = serviceManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyAssignments()
    {
        var userId = User.GetUserId();
        var student = await _serviceManager.StudentService.GetByUserIdAsync(userId, false);
        if (student == null) 
            return NotFound(new { message = "Student profile not found." });

        var assignments = await _serviceManager.AssignmentService.GetByClassAsync(student.ClassId, false);
        return Ok(assignments);
    }
}