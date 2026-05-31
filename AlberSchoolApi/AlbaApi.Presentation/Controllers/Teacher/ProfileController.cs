using Contracts.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AlbaApi.Presentation.Controllers.Teacher;

[ApiController]
[Route("api/teacher/profile")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireTeacher")]
public class ProfileController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetProfile([FromServices] IRepositoryManager repo)
    {
        var userId = User.GetUserId();
        var teacher = await repo.TeacherRepository.GetByUserIdAsync(userId, false);
        if (teacher == null) return NotFound(new { message = "Teacher profile not found." });

        return Ok(new
        {
            teacher.Id,
            UserId = teacher.UserId,
            FullName = teacher.User?.FullName ?? "Unknown",
            Email = teacher.User?.Email ?? "",
            teacher.Qualification,
            teacher.Specialization,
            HireDate = teacher.HireDate,
        });
    }
}
