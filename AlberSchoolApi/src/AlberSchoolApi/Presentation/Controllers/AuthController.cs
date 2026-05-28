using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.DTOs.Auth;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.Identity;
using AlberSchoolApi.Domain.Enums;
using AlberSchoolApi.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlberSchoolApi.Presentation.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _users;
    private readonly ITokenService _tokens;
    private readonly IBaseRepository<RefreshToken> _refreshTokens;
    private readonly IConfiguration _config;

    public AuthController(IUserRepository users, ITokenService tokens, IBaseRepository<RefreshToken> refreshTokens, IConfiguration config)
    {
        _users = users;
        _tokens = tokens;
        _refreshTokens = refreshTokens;
        _config = config;
    }

    /// <summary>Log in with email and password.</summary>
    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login([FromBody] LoginRequest req, CancellationToken ct)
    {
        var user = await _users.GetByEmailAsync(req.Email.ToLower(), ct);
        if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized(ApiResponse<LoginResponse>.Fail("Invalid email or password."));

        if (user.Status != UserStatus.Active)
            return Unauthorized(ApiResponse<LoginResponse>.Fail("Account is not active."));

        var accessToken = _tokens.GenerateAccessToken(user);
        var refreshTokenValue = _tokens.GenerateRefreshToken();
        var expiryDays = int.Parse(_config["JwtSettings:RefreshTokenExpiryDays"] ?? "30");
        var refreshTokenEntity = new RefreshToken
        {
            UserId = user.Id,
            Token = refreshTokenValue,
            ExpiresAt = DateTime.UtcNow.AddDays(expiryDays)
        };
        await _refreshTokens.AddAsync(refreshTokenEntity, ct);
        user.LastLoginAt = DateTime.UtcNow;
        await _users.UpdateAsync(user, ct);
        await _users.SaveChangesAsync(ct);

        var userWithPerms = await _users.GetWithPermissionsAsync(user.Id, ct);
        var perms = userWithPerms?.UserPermissions.Select(up => up.Permission.Code) ?? [];

        var response = new LoginResponse(
            accessToken,
            refreshTokenValue,
            refreshTokenEntity.ExpiresAt,
            new UserDto(user.Id, user.Name, user.Email, user.Phone, user.Avatar, user.Role, user.Status, user.LastLoginAt, perms)
        );
        return Ok(ApiResponse<LoginResponse>.Ok(response, "Login successful."));
    }

    /// <summary>Exchange a valid refresh token for a new access token.</summary>
    [HttpPost("refresh")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Refresh([FromBody] RefreshTokenRequest req, CancellationToken ct)
    {
        var token = await _refreshTokens.FirstOrDefaultAsync(rt => rt.Token == req.RefreshToken && !rt.IsRevoked, ct);
        if (token is null || token.ExpiresAt < DateTime.UtcNow)
            return Unauthorized(ApiResponse<LoginResponse>.Fail("Invalid or expired refresh token."));

        var user = await _users.GetWithPermissionsAsync(token.UserId, ct);
        if (user is null) return Unauthorized(ApiResponse<LoginResponse>.Fail("User not found."));

        // Rotate refresh token
        token.IsRevoked = true;
        token.RevokedAt = DateTime.UtcNow;
        var newRefreshValue = _tokens.GenerateRefreshToken();
        token.ReplacedByToken = newRefreshValue;
        await _refreshTokens.UpdateAsync(token, ct);

        var expiryDays = int.Parse(_config["JwtSettings:RefreshTokenExpiryDays"] ?? "30");
        var newRefreshToken = new RefreshToken { UserId = user.Id, Token = newRefreshValue, ExpiresAt = DateTime.UtcNow.AddDays(expiryDays) };
        await _refreshTokens.AddAsync(newRefreshToken, ct);
        await _refreshTokens.SaveChangesAsync(ct);

        var accessToken = _tokens.GenerateAccessToken(user);
        var perms = user.UserPermissions.Select(up => up.Permission.Code);
        var response = new LoginResponse(accessToken, newRefreshValue, newRefreshToken.ExpiresAt, new UserDto(user.Id, user.Name, user.Email, user.Phone, user.Avatar, user.Role, user.Status, user.LastLoginAt, perms));
        return Ok(ApiResponse<LoginResponse>.Ok(response));
    }

    /// <summary>Logout — revoke the refresh token.</summary>
    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult<ApiResponse>> Logout([FromBody] RefreshTokenRequest req, CancellationToken ct)
    {
        var token = await _refreshTokens.FirstOrDefaultAsync(rt => rt.Token == req.RefreshToken, ct);
        if (token is not null)
        {
            token.IsRevoked = true;
            token.RevokedAt = DateTime.UtcNow;
            await _refreshTokens.UpdateAsync(token, ct);
            await _refreshTokens.SaveChangesAsync(ct);
        }
        return Ok(ApiResponse.Ok("Logged out successfully."));
    }

    /// <summary>Request a password reset email.</summary>
    [HttpPost("forgot-password")]
    public async Task<ActionResult<ApiResponse>> ForgotPassword([FromBody] ForgotPasswordRequest req, CancellationToken ct)
    {
        var user = await _users.GetByEmailAsync(req.Email.ToLower(), ct);
        if (user is not null)
        {
            user.PasswordResetToken = Guid.NewGuid().ToString("N");
            user.PasswordResetExpiresAt = DateTime.UtcNow.AddHours(2);
            await _users.UpdateAsync(user, ct);
            await _users.SaveChangesAsync(ct);
            // TODO: dispatch email via IEmailService
        }
        return Ok(ApiResponse.Ok("If an account exists with that email, a reset link has been sent."));
    }

    /// <summary>Reset password using the token sent to email.</summary>
    [HttpPost("reset-password")]
    public async Task<ActionResult<ApiResponse>> ResetPassword([FromBody] ResetPasswordRequest req, CancellationToken ct)
    {
        if (req.NewPassword != req.ConfirmPassword)
            return BadRequest(ApiResponse.Fail("Passwords do not match."));

        var user = await _users.GetByResetTokenAsync(req.Token, ct);
        if (user is null) return BadRequest(ApiResponse.Fail("Invalid or expired token."));

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
        user.PasswordResetToken = null;
        user.PasswordResetExpiresAt = null;
        await _users.UpdateAsync(user, ct);
        await _users.SaveChangesAsync(ct);
        return Ok(ApiResponse.Ok("Password reset successfully."));
    }

    /// <summary>Get the currently authenticated user's profile.</summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<UserDto>>> Me(CancellationToken ct)
    {
        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;
        if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

        var user = await _users.GetWithPermissionsAsync(userId, ct);
        if (user is null) return NotFound(ApiResponse<UserDto>.Fail("User not found."));

        var perms = user.UserPermissions.Select(up => up.Permission.Code);
        return Ok(ApiResponse<UserDto>.Ok(new UserDto(user.Id, user.Name, user.Email, user.Phone, user.Avatar, user.Role, user.Status, user.LastLoginAt, perms)));
    }
}
