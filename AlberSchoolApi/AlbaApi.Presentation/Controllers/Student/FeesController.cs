using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Student;

[ApiController]
[Route("api/student/fees")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireStudent")]
public class FeesController(IServiceManager service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMyFees()
    {
        var invoices = await service.StudentService.GetMyInvoicesAsync(User.GetUserId(), false);
        return Ok(invoices);
    }

    [HttpGet("invoice")]
    public async Task<IActionResult> GetCurrentInvoice()
    {
        var invoices = await service.StudentService.GetMyInvoicesAsync(User.GetUserId(), false);
        return Ok(invoices.FirstOrDefault());
    }
}
