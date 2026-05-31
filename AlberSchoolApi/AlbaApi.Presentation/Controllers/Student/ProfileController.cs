using Contracts.Repositories;
using DTOs.Student;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AlbaApi.Presentation.Controllers.Student;

[ApiController]
[Route("api/student/profile")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireStudent")]
public class ProfileController(IServiceManager service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetProfile([FromServices] IRepositoryManager repo)
    {
        var userId = User.GetUserId();
        var student = await repo.StudentRepository.GetByUserIdAsync(userId, false);
        if (student == null) return NotFound(new { message = "Student profile not found." });

        var cls = student.ClassId > 0
            ? repo.ClassRepository.FindByCondition(c => c.Id == student.ClassId, false).FirstOrDefault()
            : null;

        return Ok(new StudentProfileDto
        {
            Id = student.Id,
            UserId = student.UserId,
            FullName = student.User != null ? student.User.FullName : "Unknown",
            Gender = student.Gender,
            DateOfBirth = student.DateOfBirth,
            Address = student.Address,
            ClassId = student.ClassId,
            ClassName = cls != null ? $"{cls.Name} {cls.Section}".Trim() : "Unknown",
            ClassSection = cls?.Section,
            ParentId = student.ParentId,
        });
    }
}
