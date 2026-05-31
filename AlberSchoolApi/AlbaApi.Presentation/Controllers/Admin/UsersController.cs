using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;
using System.Security.Claims;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/users")]
[EnableRateLimiting("write")]
[Authorize(Policy = "RequireAdmin")]
public class UsersController(IServiceManager service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var students = await service.StudentService.GetAllStudentsAsync(false);
        var teachers = await service.TeacherService.GetAllAsync(false);
        return Ok(new { Students = students, Teachers = teachers });
    }

    [HttpGet("students")]
    public async Task<IActionResult> GetAllStudents()
    {
        var students = await service.StudentService.GetAllStudentsAsync(false);
        return Ok(students);
    }

    [HttpGet("teachers")]
    public async Task<IActionResult> GetAllTeachers()
    {
        var teachers = await service.TeacherService.GetAllAsync(false);
        return Ok(teachers);
    }
}
