using DTOs.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Teacher;

[ApiController]
[Route("api/teacher/profile")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireTeacher")]
public class ProfileController : ControllerBase
{
    private readonly IServiceManager _serviceManager;

    public ProfileController(IServiceManager serviceManager)
    {
        _serviceManager = serviceManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.GetUserId();
        var teacherDto = await _serviceManager.TeacherService.GetTeacherByUserIdAsync(userId, false);
        if (teacherDto == null) 
            return NotFound(new { message = "Teacher profile not found." });

        return Ok(new
        {
            teacherDto.Id,
            UserId = teacherDto.UserId,
            FullName = teacherDto.FirstName + " " + teacherDto.LastName,
            Email = teacherDto.Email,
            teacherDto.Qualification,
            teacherDto.Specialization,
            teacherDto.HireDate,
        });
    }
}
