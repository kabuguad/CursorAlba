using Contracts.Repositories;
using Entities.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using TeacherEntity = Entities.Models.User.Teacher;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/staff")]
[EnableRateLimiting("write")]
[Authorize(Policy = "RequireAdmin")]
public class StaffAdminController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromServices] IRepositoryManager repo,
        [FromServices] UserManager<ApplicationUser> userManager)
    {
        var teachers = await repo.TeacherRepository
            .FindAll(false)
            .Include(t => t.User)
            .ToListAsync();

        var result = new List<object>();
        foreach (var t in teachers)
        {
            var roles = t.User != null ? await userManager.GetRolesAsync(t.User) : new List<string>();
            result.Add(new
            {
                id = t.Id.ToString(),
                userId = t.UserId,
                firstName = t.User?.FirstName ?? "",
                lastName = t.User?.LastName ?? "",
                email = t.User?.Email ?? "",
                qualification = t.Qualification,
                specialization = t.Specialization,
                hireDate = t.HireDate?.ToString("yyyy-MM-dd"),
                role = roles.FirstOrDefault() ?? "Teacher",
                status = "active",
            });
        }
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateStaffDto dto,
        [FromServices] UserManager<ApplicationUser> userManager,
        [FromServices] IRepositoryManager repo)
    {
        var user = new ApplicationUser
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            UserName = dto.Email,
            EmailConfirmed = true,
        };
        var result = await userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

        await userManager.AddToRoleAsync(user, "Teacher");

        var teacher = new TeacherEntity
        {
            UserId = user.Id,
            Qualification = dto.Qualification,
            Specialization = dto.Specialization,
            HireDate = dto.HireDate.HasValue ? dto.HireDate.Value.ToUniversalTime() : DateTime.UtcNow,
        };
        repo.TeacherRepository.Create(teacher);
        await repo.SaveAsync();

        return StatusCode(201, new
        {
            id = teacher.Id.ToString(),
            userId = user.Id,
            firstName = user.FirstName,
            lastName = user.LastName,
            email = user.Email,
            qualification = teacher.Qualification,
            specialization = teacher.Specialization,
            hireDate = teacher.HireDate?.ToString("yyyy-MM-dd"),
            role = "Teacher",
            status = "active",
        });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id,
        [FromBody] UpdateStaffDto dto,
        [FromServices] IRepositoryManager repo,
        [FromServices] UserManager<ApplicationUser> userManager)
    {
        var teacher = await repo.TeacherRepository
            .FindByCondition(t => t.Id == id, true)
            .Include(t => t.User)
            .FirstOrDefaultAsync();

        if (teacher == null) return NotFound();

        if (teacher.User != null)
        {
            teacher.User.FirstName = dto.FirstName;
            teacher.User.LastName = dto.LastName;
            if (dto.Email != teacher.User.Email)
            {
                teacher.User.Email = dto.Email;
                teacher.User.UserName = dto.Email;
            }
            await userManager.UpdateAsync(teacher.User);
        }

        teacher.Qualification = dto.Qualification;
        teacher.Specialization = dto.Specialization;
        if (dto.HireDate.HasValue) teacher.HireDate = dto.HireDate.Value.ToUniversalTime();
        teacher.UpdatedAt = DateTime.UtcNow;

        repo.Update(teacher);
        await repo.SaveAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id,
        [FromServices] IRepositoryManager repo,
        [FromServices] UserManager<ApplicationUser> userManager)
    {
        var teacher = await repo.TeacherRepository
            .FindByCondition(t => t.Id == id, true)
            .Include(t => t.User)
            .FirstOrDefaultAsync();

        if (teacher == null) return NotFound();

        repo.TeacherRepository.Delete(teacher);
        await repo.SaveAsync();

        if (teacher.User != null)
            await userManager.DeleteAsync(teacher.User);

        return NoContent();
    }
}

public record CreateStaffDto(
    string FirstName, string LastName, string Email, string Password,
    string? Qualification, string? Specialization, DateTime? HireDate);

public record UpdateStaffDto(
    string FirstName, string LastName, string Email,
    string? Qualification, string? Specialization, DateTime? HireDate);
