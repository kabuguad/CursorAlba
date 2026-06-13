using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;
using DTOs.User;
using System.Security.Claims;

namespace AlbaApi.Presentation.Controllers.Parent;

[ApiController]
[Route("api/parent/children")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireParent")]
public class ChildrenController(IServiceManager service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMyChildren()
    {
        var userId = User.GetUserId();
        var parent = await service.ParentService.GetByUserIdAsync(userId, false);
        if (parent == null) return NotFound(new { message = "Parent profile not found." });
        var children = await service.ParentService.GetChildrenAsync(parent.Id);
        return Ok(children);
    }

    [HttpGet("{studentId:int}/grades")]
    public async Task<IActionResult> GetChildGrades(int studentId)
    {
        var grades = await service.GradeService.GetGradesForStudentAsync(studentId, false);
        return Ok(grades);
    }

    [HttpGet("{studentId:int}/fees")]
    public async Task<IActionResult> GetChildFees(int studentId)
    {
        var invoices = await service.FeeService.GetInvoicesForStudentAsync(studentId, false);
        return Ok(invoices);
    }
}
