using DTOs.User;
using Entities.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/staff")]
[EnableRateLimiting("write")]
[Authorize(Policy = "RequireAdmin")]
public class StaffAdminController : ControllerBase
{
    private readonly IServiceManager _serviceManager;
    private readonly UserManager<ApplicationUser> _userManager;

    public StaffAdminController(IServiceManager serviceManager, UserManager<ApplicationUser> userManager)
    {
        _serviceManager = serviceManager;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var teachers = await _serviceManager.TeacherService.GetAllTeachersAsync(false);
        var result = new List<object>();
        foreach (var teacher in teachers)
        {
            var user = await _userManager.FindByIdAsync(teacher.UserId.ToString());
            var roles = user != null ? await _userManager.GetRolesAsync(user) : new List<string>();
            result.Add(new
            {
                id = teacher.Id.ToString(),
                userId = teacher.UserId,
                firstName = teacher.FirstName,
                lastName = teacher.LastName,
                email = teacher.Email,
                qualification = teacher.Qualification,
                specialization = teacher.Specialization,
                hireDate = teacher.HireDate?.ToString("yyyy-MM-dd"),
                role = roles.FirstOrDefault() ?? "Teacher",
                status = "active",
            });
        }
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateStaffDto dto)
    {
        var user = new ApplicationUser
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            UserName = dto.Email,
            EmailConfirmed = true,
        };
        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

        await _userManager.AddToRoleAsync(user, "Teacher");

        var teacherCreateDto = new TeacherCreateDto
        {
            Qualification = dto.Qualification,
            Specialization = dto.Specialization,
            HireDate = dto.HireDate
        };

        var teacherDto = await _serviceManager.TeacherService.CreateTeacherAsync(teacherCreateDto);
        return StatusCode(201, new
        {
            id = teacherDto.Id.ToString(),
            userId = teacherDto.UserId,
            firstName = teacherDto.FirstName,
            lastName = teacherDto.LastName,
            email = teacherDto.Email,
            qualification = teacherDto.Qualification,
            specialization = teacherDto.Specialization,
            hireDate = teacherDto.HireDate?.ToString("yyyy-MM-dd"),
            role = "Teacher",
            status = "active",
        });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id,
        [FromBody] UpdateStaffDto dto)
    {
        // Update user info via UserManager
        var teacher = await _serviceManager.TeacherService.GetTeacherByIdAsync(id, false);
        if (teacher == null) return NotFound();

        var user = await _userManager.FindByIdAsync(teacher.UserId.ToString());
        if (user == null) return NotFound(); // Should not happen

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        if (dto.Email != user.Email)
        {
            user.Email = dto.Email;
            user.UserName = dto.Email;
        }
        await _userManager.UpdateAsync(user);

        // Update teacher details via service
        TeacherUpdateDto teacherUpdateDto = new TeacherUpdateDto
        {
            Qualification = dto.Qualification,
            Specialization = dto.Specialization,
            HireDate = dto.HireDate
        };

        await _serviceManager.TeacherService.UpdateTeacherAsync(id, teacherUpdateDto);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id,
        [FromServices] UserManager<ApplicationUser> userManager)
    {
        var teacher = await _serviceManager.TeacherService.GetTeacherByIdAsync(id, false);
        if (teacher == null) return NotFound();

        // Delete teacher via service
        await _serviceManager.TeacherService.DeleteTeacherAsync(id);

        // Delete user via UserManager
        var user = await userManager.FindByIdAsync(teacher.UserId.ToString());
        if (user != null)
            await userManager.DeleteAsync(user);

        return NoContent();
    }
}