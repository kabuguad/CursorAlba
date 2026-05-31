using Contracts.Repositories;
using Entities.Models.Finance;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/fees")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireAdmin")]
public class FeesController : ControllerBase
{
    [HttpGet]
    public IActionResult GetFeeStructures([FromServices] IRepositoryManager repo)
    {
        var fees = repo.FeeRepository.FindAll(false)
            .Include(f => f.Class)
            .ToList();
        return Ok(fees.Select(f => new
        {
            f.Id, f.Name, f.Amount, f.Term, f.AcademicYear,
            f.ClassId, ClassName = f.Class?.Name ?? "",
            f.FeeType, f.DueDate, f.Status,
        }));
    }

    [HttpPost]
    public async Task<IActionResult> CreateFeeStructure(
        [FromBody] UpsertFeeDto dto,
        [FromServices] IRepositoryManager repo)
    {
        var fee = new FeeStructure
        {
            Name = dto.Name,
            Amount = dto.Amount,
            Term = dto.Term,
            AcademicYear = dto.AcademicYear,
            ClassId = dto.ClassId,
            FeeType = dto.FeeType,
            DueDate = dto.DueDate.ToUniversalTime(),
        };
        repo.FeeRepository.Create(fee);
        await repo.SaveAsync();
        return StatusCode(201, new { fee.Id, fee.Name, fee.Amount });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateFeeStructure(int id,
        [FromBody] UpsertFeeDto dto,
        [FromServices] IRepositoryManager repo)
    {
        var fee = await repo.FeeRepository
            .FindByCondition(f => f.Id == id, true)
            .FirstOrDefaultAsync();
        if (fee == null) return NotFound();

        fee.Name = dto.Name;
        fee.Amount = dto.Amount;
        fee.Term = dto.Term;
        fee.AcademicYear = dto.AcademicYear;
        fee.ClassId = dto.ClassId;
        fee.FeeType = dto.FeeType;
        fee.DueDate = dto.DueDate.ToUniversalTime();
        fee.UpdatedAt = DateTime.UtcNow;

        repo.Update(fee);
        await repo.SaveAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteFeeStructure(int id, [FromServices] IRepositoryManager repo)
    {
        var fee = await repo.FeeRepository
            .FindByCondition(f => f.Id == id, true)
            .FirstOrDefaultAsync();
        if (fee == null) return NotFound();

        repo.FeeRepository.Delete(fee);
        await repo.SaveAsync();
        return NoContent();
    }
}

public record UpsertFeeDto(
    string Name, decimal Amount, string? Term, string? AcademicYear,
    int ClassId, string? FeeType, DateTime DueDate);
