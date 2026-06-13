using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;
using System.Security.Claims;

namespace AlbaApi.Presentation.Controllers.Student;

[ApiController]
[Route("api/student/grades")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireStudent")]
public class GradesController(IServiceManager service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMyGrades()
    {
        var userId = User.GetUserId();
        var student = await service.StudentService.GetByUserIdAsync(userId, false);
        if (student == null) return NotFound(new { message = "Student profile not found." });
        var grades = await service.GradeService.GetGradesForStudentAsync(student.Id, false);
        return Ok(grades);
    }
}
