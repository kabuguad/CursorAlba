using Contracts.Repositories;
using Entities.Models.Content;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/content")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireAdmin")]
public class ContentAdminController : ControllerBase
{
    // ── Site Settings (Home + About) ────────────────────────────────────────

    [HttpGet("settings")]
    public async Task<IActionResult> GetSettings([FromServices] IRepositoryManager repo)
    {
        var settings = await repo.SiteSettingRepository.GetAllAsync(false);
        return Ok(settings.Select(s => new { s.Key, s.Value }));
    }

    [HttpPut("settings")]
    public async Task<IActionResult> UpsertSettings(
        [FromBody] List<SettingDto> dtos,
        [FromServices] IRepositoryManager repo)
    {
        foreach (var dto in dtos)
        {
            var existing = await repo.SiteSettingRepository.GetByKeyAsync(dto.Key, true);
            if (existing != null)
            {
                existing.Value = dto.Value;
                existing.UpdatedAt = DateTime.UtcNow;
                repo.Update(existing);
            }
            else
            {
                repo.SiteSettingRepository.Create(new SiteSetting { Key = dto.Key, Value = dto.Value });
            }
        }
        await repo.SaveAsync();
        return NoContent();
    }

    // ── Program Levels ──────────────────────────────────────────────────────

    [HttpGet("program-levels")]
    public async Task<IActionResult> GetProgramLevels([FromServices] IRepositoryManager repo)
    {
        var levels = await repo.ProgramLevelRepository.GetAllOrderedAsync(false);
        return Ok(levels.Select(p => new
        {
            p.Id, p.Slug, p.Name, p.Ages, p.Description, p.ImageUrl, p.SortOrder, p.CreatedAt
        }));
    }

    [HttpPost("program-levels")]
    public async Task<IActionResult> CreateProgramLevel(
        [FromBody] UpsertProgramLevelDto dto,
        [FromServices] IRepositoryManager repo)
    {
        var level = new ProgramLevel
        {
            Slug = dto.Slug,
            Name = dto.Name,
            Ages = dto.Ages,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            SortOrder = dto.SortOrder,
        };
        repo.ProgramLevelRepository.Create(level);
        await repo.SaveAsync();
        return StatusCode(201, new { level.Id, level.Slug, level.Name, level.Ages, level.Description, level.ImageUrl, level.SortOrder });
    }

    [HttpPut("program-levels/{id:int}")]
    public async Task<IActionResult> UpdateProgramLevel(
        int id,
        [FromBody] UpsertProgramLevelDto dto,
        [FromServices] IRepositoryManager repo)
    {
        var level = await repo.ProgramLevelRepository
            .FindByCondition(p => p.Id == id, true)
            .FirstOrDefaultAsync();
        if (level == null) return NotFound();

        level.Slug = dto.Slug;
        level.Name = dto.Name;
        level.Ages = dto.Ages;
        level.Description = dto.Description;
        level.ImageUrl = dto.ImageUrl;
        level.SortOrder = dto.SortOrder;
        level.UpdatedAt = DateTime.UtcNow;

        repo.Update(level);
        await repo.SaveAsync();
        return NoContent();
    }

    [HttpDelete("program-levels/{id:int}")]
    public async Task<IActionResult> DeleteProgramLevel(int id, [FromServices] IRepositoryManager repo)
    {
        var level = await repo.ProgramLevelRepository
            .FindByCondition(p => p.Id == id, true)
            .FirstOrDefaultAsync();
        if (level == null) return NotFound();

        repo.ProgramLevelRepository.Delete(level);
        await repo.SaveAsync();
        return NoContent();
    }

    // ── Public Fee Rows ─────────────────────────────────────────────────────

    [HttpGet("public-fees")]
    public async Task<IActionResult> GetPublicFees([FromServices] IRepositoryManager repo)
    {
        var rows = await repo.PublicFeeRowRepository.GetAllOrderedAsync(false);
        return Ok(rows.Select(f => new
        {
            f.Id, f.Level, f.Tuition, f.Transport, f.Activities, f.SortOrder,
            Total = f.Tuition + f.Transport + f.Activities
        }));
    }

    [HttpPost("public-fees")]
    public async Task<IActionResult> CreatePublicFeeRow(
        [FromBody] UpsertPublicFeeRowDto dto,
        [FromServices] IRepositoryManager repo)
    {
        var row = new PublicFeeRow
        {
            Level = dto.Level,
            Tuition = dto.Tuition,
            Transport = dto.Transport,
            Activities = dto.Activities,
            SortOrder = dto.SortOrder,
        };
        repo.PublicFeeRowRepository.Create(row);
        await repo.SaveAsync();
        return StatusCode(201, new { row.Id, row.Level, row.Tuition, row.Transport, row.Activities, row.SortOrder });
    }

    [HttpPut("public-fees/{id:int}")]
    public async Task<IActionResult> UpdatePublicFeeRow(
        int id,
        [FromBody] UpsertPublicFeeRowDto dto,
        [FromServices] IRepositoryManager repo)
    {
        var row = await repo.PublicFeeRowRepository
            .FindByCondition(f => f.Id == id, true)
            .FirstOrDefaultAsync();
        if (row == null) return NotFound();

        row.Level = dto.Level;
        row.Tuition = dto.Tuition;
        row.Transport = dto.Transport;
        row.Activities = dto.Activities;
        row.SortOrder = dto.SortOrder;
        row.UpdatedAt = DateTime.UtcNow;

        repo.Update(row);
        await repo.SaveAsync();
        return NoContent();
    }

    [HttpDelete("public-fees/{id:int}")]
    public async Task<IActionResult> DeletePublicFeeRow(int id, [FromServices] IRepositoryManager repo)
    {
        var row = await repo.PublicFeeRowRepository
            .FindByCondition(f => f.Id == id, true)
            .FirstOrDefaultAsync();
        if (row == null) return NotFound();

        repo.PublicFeeRowRepository.Delete(row);
        await repo.SaveAsync();
        return NoContent();
    }
}

public record SettingDto(string Key, string Value);
public record UpsertProgramLevelDto(string Slug, string Name, string Ages, string Description, string? ImageUrl, int SortOrder);
public record UpsertPublicFeeRowDto(string Level, decimal Tuition, decimal Transport, decimal Activities, int SortOrder);
