using DTOs.Student;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Student;

[ApiController]
[Route("api/student/profile")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireStudent")]
public class ProfileController(IServiceManager service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.GetUserId();
        var student = await service.StudentService.GetByUserIdAsync(userId, false);
        if (student == null) 
            return NotFound(new { message = "Student profile not found." });

        // Get detailed student info including class information
        var studentDto = await service.StudentService.GetStudentByIdAsync(student.Id, false);
        if (studentDto == null)
            return NotFound(new { message = "Student profile not found." });

        return Ok(new StudentProfileDto
        {
            Id = studentDto.Id,
            UserId = studentDto.UserId,
            FullName = $"{studentDto.FirstName} {studentDto.LastName}".Trim(),
            Gender = studentDto.Gender,
            DateOfBirth = studentDto.DateOfBirth,
            Address = studentDto.Address,
            ClassId = studentDto.ClassId,
            ClassName = studentDto.ClassName,
            ClassSection = studentDto.ClassSection,
            ParentId = studentDto.ParentId,
        });
    }
}
