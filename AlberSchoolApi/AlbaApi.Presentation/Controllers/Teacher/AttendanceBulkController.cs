using Contracts.Repositories;
using DTOs.Attendance;
using Entities.Models.Attendance;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

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
        [FromBody] List<AttendanceMarkDto> records,
        [FromServices] IRepositoryManager repo)
    {
        if (records == null || records.Count == 0)
            return BadRequest(new { message = "No attendance records provided." });

        var userId = User.GetUserId();
        foreach (var dto in records)
        {
            var date = dto.Date.Date;
            var existing = await repo.AttendanceRepository
                .FindByCondition(a => a.StudentId == dto.StudentId && a.Date == date, true)
                .FirstOrDefaultAsync();

            if (existing != null)
            {
                existing.Status = (Entities.Models.Attendance.AttendanceStatus)(int)dto.Status;
                existing.Remarks = dto.Remarks;
            }
            else
            {
                var record = new AttendanceRecord
                {
                    StudentId = dto.StudentId,
                    Date = date,
                    Status = (Entities.Models.Attendance.AttendanceStatus)(int)dto.Status,
                    Remarks = dto.Remarks,
                    RecordedById = userId,
                };
                repo.AttendanceRepository.Create(record);
            }
        }

        await repo.SaveAsync();
        return Ok(new { saved = records.Count });
    }
}
