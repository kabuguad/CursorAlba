using DTOs.Student;
using Entities.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/students")]
[EnableRateLimiting("write")]
[Authorize(Policy = "RequireAdmin")]
public class StudentsAdminController : ControllerBase
{
    private readonly IServiceManager _serviceManager;
    private readonly UserManager<ApplicationUser> _userManager;

    public StudentsAdminController(IServiceManager serviceManager, UserManager<ApplicationUser> userManager)
    {
        _serviceManager = serviceManager;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var students = await _serviceManager.StudentService.GetAllStudentsAsync(false);
        return Ok(students);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var student = await _serviceManager.StudentService.GetStudentByIdAsync(id, false);
        if (student == null) return NotFound();
        return Ok(student);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] StudentCreateRequestDto requestDto)
    {
        var user = new ApplicationUser
        {
            FirstName = requestDto.FirstName,
            LastName = requestDto.LastName,
            Email = requestDto.Email,
            UserName = requestDto.Email,
            EmailConfirmed = true,
        };
        var result = await _userManager.CreateAsync(user, requestDto.Password);
        if (!result.Succeeded)
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

        await _userManager.AddToRoleAsync(user, "Student");

        var studentCreateDto = new StudentCreateDto
        {
            ClassId = requestDto.ClassId,
            ParentId = requestDto.ParentId,
            DateOfBirth = requestDto.DateOfBirth,
            Gender = requestDto.Gender,
            Address = requestDto.Address
        };

        var studentDto = await _serviceManager.StudentService.CreateStudentAsync(user.Id, studentCreateDto);
        return StatusCode(201, studentDto);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id,
        [FromBody] StudentUpdateRequestDto requestDto)
    {
        // Update user info via UserManager
        var student = await _serviceManager.StudentService.GetStudentByIdAsync(id, false);
        if (student == null) return NotFound();

        var user = await _userManager.FindByIdAsync(student.UserId.ToString());
        if (user == null) return NotFound(); // Should not happen

        user.FirstName = requestDto.FirstName;
        user.LastName = requestDto.LastName;
        if (requestDto.Email != user.Email)
        {
            user.Email = requestDto.Email;
            user.UserName = requestDto.Email;
        }
        await _userManager.UpdateAsync(user);

        // Update student details via service
        var studentUpdateDto = new StudentUpdateDto
        {
            ClassId = requestDto.ClassId,
            ParentId = requestDto.ParentId,
            DateOfBirth = requestDto.DateOfBirth,
            Gender = requestDto.Gender,
            Address = requestDto.Address
        };

        await _serviceManager.StudentService.UpdateStudentAsync(id, studentUpdateDto);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id,
        [FromServices] UserManager<ApplicationUser> userManager)
    {
        var student = await _serviceManager.StudentService.GetStudentByIdAsync(id, false);
        if (student == null) return NotFound();

        // Delete student via service (which will delete student entity)
        await _serviceManager.StudentService.DeleteStudentAsync(id);

        // Delete user via UserManager
        var user = await userManager.FindByIdAsync(student.UserId.ToString());
        if (user != null)
            await userManager.DeleteAsync(user);

        return NoContent();
    }
}