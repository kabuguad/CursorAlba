using DTOs.Attendance;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Teacher;

[ApiController]
[Route("api/teacher/attendance/class/{classId:int}")]
[EnableRateLimiting("write")]
[Authorize(Policy = "RequireTeacher")]
public class AttendanceBulkController(IServiceManager service) : ControllerBase
{
    [HttpGet("today")]
    public async Task<IActionResult> GetTodayAttendance(int classId)
    {
        var today = DateTime.UtcNow.Date;
        var records = await service.AttendanceService.GetAttendanceForClassAsync(classId, today, false);
        return Ok(records);
    }

    [HttpPost("bulk")]
    public async Task<IActionResult> SaveBulkAttendance(
        int classId,
        [FromBody] List<AttendanceMarkDto> records)
    {
        if (records == null || records.Count == 0)
            return BadRequest(new { message = "No attendance records provided." });

        foreach (var dto in records)
        {
            await service.AttendanceService.MarkAttendanceAsync(dto);
        }

        return Ok(new { saved = records.Count });
    }
}
