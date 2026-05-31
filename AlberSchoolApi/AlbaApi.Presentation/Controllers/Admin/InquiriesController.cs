using Contracts.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/inquiries")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireAdmin")]
public class InquiriesController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromServices] IRepositoryManager repo)
    {
        var inquiries = await repo.InquiryRepository
            .FindAll(false)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();
        return Ok(inquiries);
    }

    [HttpPatch("{id:int}/respond")]
    public async Task<IActionResult> Respond(int id,
        [FromBody] RespondDto dto,
        [FromServices] IRepositoryManager repo)
    {
        var inquiry = await repo.InquiryRepository
            .FindByCondition(i => i.Id == id, true)
            .FirstOrDefaultAsync();
        if (inquiry == null) return NotFound();

        inquiry.Response = dto.Response;
        inquiry.Status = "Responded";
        inquiry.UpdatedAt = DateTime.UtcNow;
        repo.Update(inquiry);
        await repo.SaveAsync();
        return Ok(inquiry);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, [FromServices] IRepositoryManager repo)
    {
        var inquiry = await repo.InquiryRepository
            .FindByCondition(i => i.Id == id, true)
            .FirstOrDefaultAsync();
        if (inquiry == null) return NotFound();

        repo.InquiryRepository.Delete(inquiry);
        await repo.SaveAsync();
        return NoContent();
    }
}

public record RespondDto(string Response);
