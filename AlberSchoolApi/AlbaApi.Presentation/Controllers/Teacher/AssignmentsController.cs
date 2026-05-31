using AlbaApi.Presentation.ActionFilters;
using Contracts.Repositories;
using DTOs.Academics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AlbaApi.Presentation.Controllers.Teacher;

[ApiController]
[Route("api/teacher/assignments")]
[EnableRateLimiting("write")]
[Authorize(Policy = "RequireTeacher")]
public class AssignmentsController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMyAssignments([FromServices] IRepositoryManager repo)
    {
        var userId = User.GetUserId();
        var teacher = await repo.TeacherRepository.GetByUserIdAsync(userId, false);
        if (teacher == null) return NotFound(new { message = "Teacher profile not found." });

        var assignments = await repo.AssignmentRepository.GetByTeacherAsync(teacher.Id, false);
        var result = assignments.Select(a => new AssignmentDto
        {
            Id = a.Id,
            Title = a.Title,
            Description = a.Description,
            DueDate = a.DueDate,
            SubjectName = a.Subject?.Name ?? "Unknown",
            TeacherName = teacher.User?.FullName ?? "TBA",
            ClassName = a.Class != null ? $"{a.Class.Name} {a.Class.Section}".Trim() : "Unknown",
            CreatedAt = a.CreatedAt,
        });

        return Ok(result);
    }

    [HttpPost]
    [ServiceFilter(typeof(ValidationFilterAttribute))]
    public async Task<IActionResult> CreateAssignment(
        [FromBody] AssignmentCreateDto dto,
        [FromServices] IRepositoryManager repo)
    {
        var userId = User.GetUserId();
        var teacher = await repo.TeacherRepository.GetByUserIdAsync(userId, false);
        if (teacher == null) return NotFound(new { message = "Teacher profile not found." });

        var assignment = new Entities.Models.Academics.Assignment
        {
            Title = dto.Title,
            Description = dto.Description,
            DueDate = dto.DueDate,
            ClassId = dto.ClassId,
            SubjectId = dto.SubjectId,
            TeacherId = teacher.Id,
        };

        repo.AssignmentRepository.Create(assignment);
        await repo.SaveAsync();
        return StatusCode(201, new { assignment.Id });
    }
}
