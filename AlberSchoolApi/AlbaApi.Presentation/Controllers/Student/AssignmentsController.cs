using Contracts.Repositories;
using DTOs.Academics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AlbaApi.Presentation.Controllers.Student;

[ApiController]
[Route("api/student/assignments")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireStudent")]
public class AssignmentsController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMyAssignments([FromServices] IRepositoryManager repo)
    {
        var userId = User.GetUserId();
        var student = await repo.StudentRepository.GetByUserIdAsync(userId, false);
        if (student == null) return NotFound(new { message = "Student profile not found." });

        var assignments = await repo.AssignmentRepository.GetByClassAsync(student.ClassId, false);
        var result = assignments.Select(a => new AssignmentDto
        {
            Id = a.Id,
            Title = a.Title,
            Description = a.Description,
            DueDate = a.DueDate,
            SubjectName = a.Subject?.Name ?? "Unknown",
            TeacherName = a.Teacher?.User != null ? a.Teacher.User.FullName : "TBA",
            CreatedAt = a.CreatedAt,
        });

        return Ok(result);
    }
}
