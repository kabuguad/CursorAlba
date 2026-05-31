using Contracts.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace AlbaApi.Presentation.Controllers.Teacher;

[ApiController]
[Route("api/teacher/classes")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireTeacher")]
public class ClassesController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMyClasses([FromServices] IRepositoryManager repo)
    {
        var userId = User.GetUserId();
        var teacher = await repo.TeacherRepository.GetByUserIdAsync(userId, false);
        if (teacher == null) return NotFound(new { message = "Teacher profile not found." });

        var classIds = await repo.TimetableRepository
            .FindByCondition(t => t.TeacherId == teacher.Id, false)
            .Select(t => t.ClassId)
            .Distinct()
            .ToListAsync();

        var classes = repo.ClassRepository
            .FindByCondition(c => classIds.Contains(c.Id), false)
            .ToList();

        var studentCounts = repo.StudentRepository
            .FindByCondition(s => classIds.Contains(s.ClassId), false)
            .GroupBy(s => s.ClassId)
            .ToDictionary(g => g.Key, g => g.Count());

        return Ok(classes.Select(c => new
        {
            c.Id,
            c.Name,
            c.Section,
            FullName = $"{c.Name} {c.Section}".Trim(),
            StudentCount = studentCounts.TryGetValue(c.Id, out var cnt) ? cnt : 0,
        }));
    }

    [HttpGet("{classId:int}/students")]
    public IActionResult GetClassStudents(int classId, [FromServices] IRepositoryManager repo)
    {
        var students = repo.StudentRepository
            .FindByCondition(s => s.ClassId == classId, false)
            .ToList();

        return Ok(students.Select(s => new
        {
            s.Id,
            UserId = s.UserId,
            FullName = s.User != null ? s.User.FullName : "Unknown",
            s.Gender,
            s.DateOfBirth,
        }));
    }
}
