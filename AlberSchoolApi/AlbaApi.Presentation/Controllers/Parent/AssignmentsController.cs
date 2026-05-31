using Contracts.Repositories;
using DTOs.Academics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AlbaApi.Presentation.Controllers.Parent;

[ApiController]
[Route("api/parent/children/{studentId:int}/assignments")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireParent")]
public class AssignmentsController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetChildAssignments(int studentId, [FromServices] IRepositoryManager repo)
    {
        var student = await repo.StudentRepository.GetWithDetailsAsync(studentId, false);
        if (student == null) return NotFound(new { message = "Student not found." });

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
