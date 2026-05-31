using Contracts.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AlbaApi.Presentation.Controllers.Parent;

[ApiController]
[Route("api/parent/children/{studentId:int}/attendance")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireParent")]
public class AttendanceController(IServiceManager service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetChildAttendance(
        int studentId,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to)
    {
        var fromDate = from ?? DateTime.UtcNow.AddMonths(-3);
        var toDate = to ?? DateTime.UtcNow;
        var records = await service.AttendanceService.GetAttendanceForStudentAsync(studentId, fromDate, toDate, false);
        return Ok(records);
    }
}
