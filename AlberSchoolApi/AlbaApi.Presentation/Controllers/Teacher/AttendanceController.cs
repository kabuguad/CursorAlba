using AlbaApi.Presentation.ActionFilters;
using DTOs.Attendance;
using Entities.Models.Attendance;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Teacher;

[ApiController]
[Route("api/teacher/attendance")]
[EnableRateLimiting("write")]
[Authorize(Policy = "RequireTeacher")]
public class AttendanceController(IServiceManager service) : ControllerBase
{
    [HttpPost("mark")]
    [ServiceFilter(typeof(ValidationFilterAttribute))]
    public async Task<IActionResult> Mark([FromBody] AttendanceMarkDto dto)
    {
        await service.AttendanceService.MarkAttendanceAsync(dto);
        return NoContent();
    }

    [HttpGet("class/{classId:int}/date/{date:datetime}")]
    public async Task<IActionResult> GetForClass(int classId, DateTime date)
    {
        var records = await service.AttendanceService.GetAttendanceForClassAsync(classId, date, false);
        return Ok(records);
    }
}
