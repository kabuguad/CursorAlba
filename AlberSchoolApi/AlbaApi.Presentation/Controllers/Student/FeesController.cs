using Contracts.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AlbaApi.Presentation.Controllers.Student;

[ApiController]
[Route("api/student/fees")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireStudent")]
public class FeesController(IServiceManager service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMyFees([FromServices] IRepositoryManager repo)
    {
        var userId = User.GetUserId();
        var student = await repo.StudentRepository.GetByUserIdAsync(userId, false);
        if (student == null) return NotFound(new { message = "Student profile not found." });
        var invoices = await service.FeeService.GetInvoicesForStudentAsync(student.Id, false);
        return Ok(invoices);
    }

    [HttpGet("invoice")]
    public async Task<IActionResult> GetCurrentInvoice([FromServices] IRepositoryManager repo)
    {
        var userId = User.GetUserId();
        var student = await repo.StudentRepository.GetByUserIdAsync(userId, false);
        if (student == null) return NotFound(new { message = "Student profile not found." });
        var invoices = await service.FeeService.GetInvoicesForStudentAsync(student.Id, false);
        return Ok(invoices.FirstOrDefault());
    }
}
