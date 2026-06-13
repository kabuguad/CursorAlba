using DTOs.Academics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Teacher;

[ApiController]
[Route("api/teacher/assignments")]
[EnableRateLimiting("write")]
[Authorize(Policy = "RequireTeacher")]
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
        var teacher = await _serviceManager.TeacherService.GetByUserIdAsync(userId, false);
        if (teacher == null) 
            return NotFound(new { message = "Teacher profile not found." });

        var assignments = await _serviceManager.AssignmentService.GetByTeacherAsync(teacher.Id, false);
        return Ok(assignments);
    }

    [HttpPost]
    [ServiceFilter(typeof(AlbaApi.Presentation.ActionFilters.ValidationFilterAttribute))]
    public async Task<IActionResult> CreateAssignment([FromBody] AssignmentCreateDto dto)
    {
        var userId = User.GetUserId();
        var teacher = await _serviceManager.TeacherService.GetByUserIdAsync(userId, false);
        if (teacher == null) 
            return NotFound(new { message = "Teacher profile not found." });

        var assignmentDto = await _serviceManager.AssignmentService.CreateAsync(dto, teacher.Id);
        return StatusCode(201, assignmentDto);
    }
}