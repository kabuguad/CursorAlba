using Contracts.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/fees")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireAdmin")]
public class FeesController(IServiceManager service) : ControllerBase
{
    [HttpGet]
    public IActionResult GetFeeStructures([FromServices] IRepositoryManager repo)
    {
        var fees = repo.FeeRepository.FindAll(false).ToList();
        return Ok(fees.Select(f => new
        {
            f.Id,
            f.Name,
            f.Amount,
            f.Term,
            f.AcademicYear,
            f.ClassId,
            f.FeeType,
            f.DueDate,
            f.Status,
        }));
    }

    [HttpPost]
    public async Task<IActionResult> CreateFeeStructure(
        [FromBody] CreateFeeDto dto,
        [FromServices] IRepositoryManager repo)
    {
        var fee = new Entities.Models.Finance.FeeStructure
        {
            Name = dto.Name,
            Amount = dto.Amount,
            Term = dto.Term,
            AcademicYear = dto.AcademicYear,
            ClassId = dto.ClassId,
            FeeType = dto.FeeType,
            DueDate = dto.DueDate,
        };
        repo.FeeRepository.Create(fee);
        await repo.SaveAsync();
        return StatusCode(201, new { fee.Id });
    }
}

public record CreateFeeDto(
    string Name, decimal Amount, string? Term, string? AcademicYear,
    int ClassId, string? FeeType, DateTime DueDate);
