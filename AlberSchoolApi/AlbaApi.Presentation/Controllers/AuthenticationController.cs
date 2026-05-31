using DTOs.User;
using Entities.Models.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AlbaApi.Presentation.ActionFilters;
using Service.Contracts;
using Service.Contracts.Authentication;

namespace AlbaApi.Presentation.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthenticationController(IAuthenticationService authService) : ControllerBase
{
    [HttpPost("register")]
    [AllowAnonymous]
    [ServiceFilter(typeof(ValidationFilterAttribute))]
    public async Task<IActionResult> Register([FromBody] UserRegistrationDto dto)
    {
        var result = await authService.RegisterUserAsync(dto);
        return CreatedAtAction(nameof(GetUserByEmail), new { email = result.Email }, result);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [ServiceFilter(typeof(ValidationFilterAttribute))]
    public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
    {
        var token = await authService.AuthenticateUserAsync(dto);
        if (token == null)
            return Unauthorized(new { message = "Invalid email or password." });
        return Ok(new { token = token, tokenType = "Bearer" });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        if (email == null) return Unauthorized();
        var user = await authService.GetUserByEmailAsync(email);
        return user is not null ? Ok(user) : Unauthorized();
    }

    private async Task<IActionResult> GetUserByEmail(string email)
    {
        var user = await authService.GetUserByEmailAsync(email);
        return user is not null ? Ok(user) : NotFound();
    }
}
