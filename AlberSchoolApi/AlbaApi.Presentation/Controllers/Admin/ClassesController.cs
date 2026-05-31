using Contracts.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/classes")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireAdmin")]
public class ClassesController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAllClasses([FromServices] IRepositoryManager repo)
    {
        var classes = repo.ClassRepository.FindAll(false).ToList();
        var studentCounts = repo.StudentRepository.FindAll(false)
            .GroupBy(s => s.ClassId)
            .ToDictionary(g => g.Key, g => g.Count());

        return Ok(classes.Select(c => new
        {
            c.Id,
            c.Name,
            c.Section,
            FullName = $"{c.Name} {c.Section}".Trim(),
            c.Description,
            StudentCount = studentCounts.TryGetValue(c.Id, out var cnt) ? cnt : 0,
        }));
    }

    [HttpPost]
    public async Task<IActionResult> CreateClass(
        [FromBody] UpsertClassDto dto,
        [FromServices] IRepositoryManager repo)
    {
        var cls = new Entities.Models.Academics.Class
        {
            Name = dto.Name,
            Section = dto.Section,
            Description = dto.Description,
        };
        repo.ClassRepository.Create(cls);
        await repo.SaveAsync();
        return StatusCode(201, new { cls.Id, cls.Name, cls.Section, cls.Description });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateClass(int id,
        [FromBody] UpsertClassDto dto,
        [FromServices] IRepositoryManager repo)
    {
        var cls = await repo.ClassRepository
            .FindByCondition(c => c.Id == id, true)
            .FirstOrDefaultAsync();
        if (cls == null) return NotFound();

        cls.Name = dto.Name;
        cls.Section = dto.Section;
        cls.Description = dto.Description;
        cls.UpdatedAt = DateTime.UtcNow;

        repo.Update(cls);
        await repo.SaveAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteClass(int id, [FromServices] IRepositoryManager repo)
    {
        var cls = await repo.ClassRepository
            .FindByCondition(c => c.Id == id, true)
            .FirstOrDefaultAsync();
        if (cls == null) return NotFound();

        repo.ClassRepository.Delete(cls);
        await repo.SaveAsync();
        return NoContent();
    }
}

public record UpsertClassDto(string Name, string? Section, string? Description);
