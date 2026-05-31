using Contracts.Repositories;
using Entities.Models.Admissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/admissions")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireAdmin")]
public class AdmissionsAdminController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromServices] IRepositoryManager repo)
    {
        var apps = await repo.ApplicationRepository
            .FindAll(false)
            .Include(a => a.ApplyingForClass)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        return Ok(apps.Select(a => MapApplication(a)));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, [FromServices] IRepositoryManager repo)
    {
        var app = await repo.ApplicationRepository
            .FindByCondition(a => a.Id == id, false)
            .Include(a => a.ApplyingForClass)
            .FirstOrDefaultAsync();
        if (app == null) return NotFound();
        return Ok(MapApplication(app));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateApplicationDto dto,
        [FromServices] IRepositoryManager repo)
    {
        var app = new Application
        {
            FirstName = dto.ChildFirstName,
            LastName = dto.ChildLastName,
            DateOfBirth = DateTime.Parse(dto.Dob).ToUniversalTime(),
            Gender = dto.Gender,
            PreviousSchool = dto.PreviousSchool,
            ApplyingForClassId = dto.ApplyingForClassId,
            ParentName = $"{dto.ParentFirstName} {dto.ParentLastName}".Trim(),
            ParentPhone = dto.ParentPhone,
            ParentEmail = dto.ParentEmail,
            Address = dto.Address,
            Status = "Pending",
        };
        repo.ApplicationRepository.Create(app);
        await repo.SaveAsync();
        return StatusCode(201, MapApplication(app));
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id,
        [FromBody] UpdateStatusDto dto,
        [FromServices] IRepositoryManager repo)
    {
        var app = await repo.ApplicationRepository
            .FindByCondition(a => a.Id == id, true)
            .FirstOrDefaultAsync();
        if (app == null) return NotFound();

        app.Status = dto.Status;
        app.ReviewNotes = dto.Notes;
        app.ReviewedAt = DateTime.UtcNow;
        repo.Update(app);
        await repo.SaveAsync();
        return Ok(MapApplication(app));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, [FromServices] IRepositoryManager repo)
    {
        var app = await repo.ApplicationRepository
            .FindByCondition(a => a.Id == id, true)
            .FirstOrDefaultAsync();
        if (app == null) return NotFound();

        repo.ApplicationRepository.Delete(app);
        await repo.SaveAsync();
        return NoContent();
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats([FromServices] IRepositoryManager repo)
    {
        var apps = await repo.ApplicationRepository.FindAll(false).ToListAsync();
        return Ok(new
        {
            total = apps.Count,
            pending = apps.Count(a => a.Status == "Pending"),
            reviewing = apps.Count(a => a.Status == "Reviewing"),
            approved = apps.Count(a => a.Status == "Approved"),
            rejected = apps.Count(a => a.Status == "Rejected"),
        });
    }

    private static object MapApplication(Application a) => new
    {
        id = a.Id.ToString(),
        childFirstName = a.FirstName,
        childLastName = a.LastName,
        dob = a.DateOfBirth.ToString("yyyy-MM-dd"),
        gender = a.Gender ?? "Unknown",
        applyingForGrade = a.ApplyingForClass?.Name ?? $"Class {a.ApplyingForClassId}",
        applyingForClassId = a.ApplyingForClassId,
        previousSchool = a.PreviousSchool,
        parentFirstName = a.ParentName?.Split(' ').FirstOrDefault() ?? "",
        parentLastName = a.ParentName != null && a.ParentName.Contains(' ')
            ? string.Join(' ', a.ParentName.Split(' ').Skip(1)) : "",
        parentEmail = a.ParentEmail ?? "",
        parentPhone = a.ParentPhone ?? "",
        parentRelationship = "Parent/Guardian",
        address = a.Address ?? "",
        documents = Array.Empty<string>(),
        status = a.Status.ToLower(),
        notes = a.ReviewNotes ?? "",
        submittedDate = a.CreatedAt.ToString("yyyy-MM-dd"),
        assignedTo = a.ReviewedById,
        reviewedAt = a.ReviewedAt,
    };
}

public record CreateApplicationDto(
    string ChildFirstName, string ChildLastName, string Dob, string? Gender,
    string? PreviousSchool, int? ApplyingForClassId,
    string ParentFirstName, string ParentLastName, string? ParentEmail, string? ParentPhone,
    string? Address);

public record UpdateStatusDto(string Status, string? Notes);
