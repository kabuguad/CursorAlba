using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;
using DTOs.Finance;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/fees")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireAdmin")]
public class FeesController(IServiceManager service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetFeeStructures()
    {
        var fees = await service.FeeService.GetAllFeeStructuresAsync(false);
        return Ok(fees);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetFeeStructure(int id)
    {
        var fee = await service.FeeService.GetFeeStructureByIdAsync(id, false);
        return Ok(fee);
    }

    [HttpPost]
    public async Task<IActionResult> CreateFeeStructure([FromBody] FeeStructureCreateDto dto)
    {
        var created = await service.FeeService.CreateFeeStructureAsync(dto);
        return StatusCode(201, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateFeeStructure(int id, [FromBody] FeeStructureUpdateDto dto)
    {
        await service.FeeService.UpdateFeeStructureAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteFeeStructure(int id)
    {
        await service.FeeService.DeleteFeeStructureAsync(id);
        return NoContent();
    }
}
