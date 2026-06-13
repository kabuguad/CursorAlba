using DTOs.Academics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Teacher;

[ApiController]
[Route("api/teacher/classes")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireTeacher")]
public class ClassesController : ControllerBase
{
    private readonly IServiceManager _serviceManager;

    public ClassesController(IServiceManager serviceManager)
    {
        _serviceManager = serviceManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyClasses()
    {
        var userId = User.GetUserId();
        var teacher = await _serviceManager.TeacherService.GetByUserIdAsync(userId, false);
        if (teacher == null) 
            return NotFound(new { message = "Teacher profile not found." });

        var classes = await _serviceManager.ClassService.GetClassesByTeacherIdAsync(teacher.Id, false);
        return Ok(classes);
    }

    [HttpGet("{classId:int}/students")]
    public async Task<IActionResult> GetClassStudents(int classId)
    {
        var students = await _serviceManager.StudentService.GetStudentsByClassIdAsync(classId, false);
        return Ok(students.Select(s => new
        {
            s.Id,
            UserId = s.UserId,
            FullName = $"{s.FirstName} {s.LastName}".Trim(),
            s.Gender,
            s.DateOfBirth,
        }));
    }
}
