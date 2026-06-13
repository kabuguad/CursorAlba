using DTOs.Admissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/inquiries")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireAdmin")]
public class InquiriesController : ControllerBase
{
    private readonly IServiceManager _serviceManager;

    public InquiriesController(IServiceManager serviceManager)
    {
        _serviceManager = serviceManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var inquiries = await _serviceManager.AdmissionsService.GetAllInquiriesAsync(false);
        return Ok(inquiries);
    }

    [HttpPatch("{id:int}/respond")]
    public async Task<IActionResult> Respond(int id, [FromBody] RespondDto dto)
    {
        var inquiryDto = await _serviceManager.AdmissionsService.RespondToInquiryAsync(id, dto);
        return Ok(inquiryDto);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _serviceManager.AdmissionsService.DeleteInquiryAsync(id);
        return NoContent();
    }
}