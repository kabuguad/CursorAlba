using DTOs.Academics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Parent;

[ApiController]
[Route("api/parent/children/{studentId:int}/assignments")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireParent")]
public class AssignmentsController : ControllerBase
{
    private readonly IServiceManager _serviceManager;

    public AssignmentsController(IServiceManager serviceManager)
    {
        _serviceManager = serviceManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetChildAssignments(int studentId)
    {
        // First get the student to verify it exists and get the classId
        var student = await _serviceManager.StudentService.GetWithDetailsAsync(studentId, false);
        if (student == null) 
            return NotFound(new { message = "Student not found." });

        // Get assignments for the student's class
        var assignments = await _serviceManager.AssignmentService.GetByClassAsync(student.ClassId, false);
        return Ok(assignments);
    }
}