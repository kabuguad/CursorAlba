using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;
using System.Security.Claims;

namespace AlbaApi.Presentation.Controllers.Student;

[ApiController]
[Route("api/student/attendance")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireStudent")]
public class AttendanceController(IServiceManager service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMyAttendance(
        [FromServices] IRepositoryManager repo,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to)
    {
        var userId = User.GetUserId();
        var student = await repo.StudentRepository.GetByUserIdAsync(userId, false);
        if (student == null) return NotFound(new { message = "Student profile not found." });
        var fromDate = from ?? DateTime.UtcNow.AddMonths(-3);
        var toDate = to ?? DateTime.UtcNow;
        var records = await service.AttendanceService.GetAttendanceForStudentAsync(student.Id, fromDate, toDate, false);
        return Ok(records);
    }
}
