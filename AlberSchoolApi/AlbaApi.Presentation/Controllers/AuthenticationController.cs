using DTOs.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AlbaApi.Presentation.ActionFilters;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthenticationController(IServiceManager serviceManager) : ControllerBase
{
    [HttpPost("register")]
    [AllowAnonymous]
    [ServiceFilter(typeof(ValidationFilterAttribute))]
    public async Task<IActionResult> Register([FromBody] UserRegistrationDto dto)
    {
        var result = await serviceManager.AuthenticationService.RegisterUserAsync(dto);
        return CreatedAtAction(nameof(GetUserByEmail), new { email = result.Email }, result);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [ServiceFilter(typeof(ValidationFilterAttribute))]
    public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
    {
        var token = await serviceManager.AuthenticationService.AuthenticateUserAsync(dto);
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
        var user = await serviceManager.AuthenticationService.GetUserByEmailAsync(email);
        return user is not null ? Ok(user) : Unauthorized();
    }

    private async Task<IActionResult> GetUserByEmail(string email)
    {
        var user = await serviceManager.AuthenticationService.GetUserByEmailAsync(email);
        return user is not null ? Ok(user) : NotFound();
    }
}
