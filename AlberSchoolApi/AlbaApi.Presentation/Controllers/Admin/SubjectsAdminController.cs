using Contracts.Repositories;
using Entities.Models.Academics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/subjects")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireAdmin")]
public class SubjectsAdminController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromServices] IRepositoryManager repo,
        [FromQuery] int? classId)
    {
        var query = repo.SubjectRepository.FindAll(false);
        if (classId.HasValue)
            query = query.Where(s => s.ClassId == classId.Value);

        var subjects = await query
            .Include(s => s.Class)
            .OrderBy(s => s.ClassId).ThenBy(s => s.Name)
            .ToListAsync();

        return Ok(subjects.Select(s => new
        {
            s.Id, s.Name, s.Code, s.ClassId,
            ClassName = s.Class?.Name ?? "",
            ClassSection = s.Class?.Section ?? "",
        }));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UpsertSubjectDto dto,
        [FromServices] IRepositoryManager repo)
    {
        var subject = new Subject
        {
            Name = dto.Name,
            Code = dto.Code,
            ClassId = dto.ClassId,
        };
        repo.SubjectRepository.Create(subject);
        await repo.SaveAsync();
        return StatusCode(201, new { subject.Id, subject.Name, subject.Code, subject.ClassId });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertSubjectDto dto,
        [FromServices] IRepositoryManager repo)
    {
        var subject = await repo.SubjectRepository
            .FindByCondition(s => s.Id == id, true)
            .FirstOrDefaultAsync();
        if (subject == null) return NotFound();

        subject.Name = dto.Name;
        subject.Code = dto.Code;
        subject.ClassId = dto.ClassId;
        subject.UpdatedAt = DateTime.UtcNow;

        repo.Update(subject);
        await repo.SaveAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, [FromServices] IRepositoryManager repo)
    {
        var subject = await repo.SubjectRepository
            .FindByCondition(s => s.Id == id, true)
            .FirstOrDefaultAsync();
        if (subject == null) return NotFound();

        repo.SubjectRepository.Delete(subject);
        await repo.SaveAsync();
        return NoContent();
    }
}

public record UpsertSubjectDto(string Name, string Code, int ClassId);
