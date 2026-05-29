using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.DTOs.Users;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.Identity;
using AlberSchoolApi.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlberSchoolApi.Presentation.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _users;
    private readonly IBaseRepository<Permission> _permissions;

    public UsersController(IUserRepository users, IBaseRepository<Permission> permissions)
    {
        _users = users;
        _permissions = permissions;
    }

    /// <summary>Get paginated list of users.</summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<UserListDto>>>> GetAll(
        [FromQuery] string? search, [FromQuery] UserRole? role, [FromQuery] UserStatus? status,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _users.SearchAsync(search, role, status, page, pageSize, ct);
        var dtos = result.Items.Select(u => new UserListDto(u.Id, u.Name, u.Email, u.Phone, u.Avatar, u.Role, u.Status, u.LastLoginAt, u.UserPermissions.Count));
        return Ok(ApiResponse<PagedResult<UserListDto>>.Ok(new PagedResult<UserListDto>
        {
            Items = dtos, TotalCount = result.TotalCount, Page = result.Page, PageSize = result.PageSize
        }));
    }

    /// <summary>Get a single user with their permissions.</summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<UserDetailDto>>> GetById(int id, CancellationToken ct)
    {
        var user = await _users.GetWithPermissionsAsync(id, ct);
        if (user is null) return NotFound(ApiResponse<UserDetailDto>.Fail("User not found."));
        return Ok(ApiResponse<UserDetailDto>.Ok(MapToDetail(user)));
    }

    /// <summary>Create a new user account.</summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<UserDetailDto>>> Create([FromBody] CreateUserRequest req, CancellationToken ct)
    {
        if (await _users.EmailExistsAsync(req.Email, ct: ct))
            return Conflict(ApiResponse<UserDetailDto>.Fail("Email already in use."));

        var user = new User
        {
            Name = req.Name,
            Email = req.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Phone = req.Phone,
            Role = req.Role,
            LinkedProfileId = req.LinkedProfileId,
            LinkedProfileType = req.LinkedProfileType
        };

        foreach (var permId in req.PermissionIds)
            user.UserPermissions.Add(new UserPermission { PermissionId = permId });

        await _users.AddAsync(user, ct);
        await _users.SaveChangesAsync(ct);

        var created = await _users.GetWithPermissionsAsync(user.Id, ct);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, ApiResponse<UserDetailDto>.Ok(MapToDetail(created!), "User created."));
    }

    /// <summary>Update a user's profile and permissions.</summary>
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<UserDetailDto>>> Update(int id, [FromBody] UpdateUserRequest req, CancellationToken ct)
    {
        var user = await _users.GetWithPermissionsAsync(id, ct);
        if (user is null) return NotFound(ApiResponse<UserDetailDto>.Fail("User not found."));

        user.Name = req.Name;
        user.Phone = req.Phone;
        user.Avatar = req.Avatar;
        user.Role = req.Role;
        user.UpdatedAt = DateTime.UtcNow;
        user.UserPermissions.Clear();
        foreach (var permId in req.PermissionIds)
            user.UserPermissions.Add(new UserPermission { PermissionId = permId });

        await _users.UpdateAsync(user, ct);
        await _users.SaveChangesAsync(ct);

        var updated = await _users.GetWithPermissionsAsync(id, ct);
        return Ok(ApiResponse<UserDetailDto>.Ok(MapToDetail(updated!), "User updated."));
    }

    /// <summary>Activate or suspend a user account.</summary>
    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult<ApiResponse>> UpdateStatus(int id, [FromBody] UpdateUserStatusRequest req, CancellationToken ct)
    {
        if (!await _users.ExistsAsync(u => u.Id == id, ct))
            return NotFound(ApiResponse.Fail("User not found."));
        await _users.UpdateStatusAsync(id, req.Status, ct);
        return Ok(ApiResponse.Ok("User status updated."));
    }

    /// <summary>Soft-delete a user account.</summary>
    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse>> Delete(int id, CancellationToken ct)
    {
        if (!await _users.ExistsAsync(u => u.Id == id, ct))
            return NotFound(ApiResponse.Fail("User not found."));
        await _users.SoftDeleteAsync(id, ct);
        return Ok(ApiResponse.Ok("User deleted."));
    }

    /// <summary>Get all available permissions.</summary>
    [HttpGet("permissions")]
    public async Task<ActionResult<ApiResponse<IEnumerable<PermissionDto>>>> GetPermissions(CancellationToken ct)
    {
        var perms = await _permissions.GetAllAsync(ct);
        return Ok(ApiResponse<IEnumerable<PermissionDto>>.Ok(perms.Select(p => new PermissionDto(p.Id, p.Code, p.Description, p.PermissionGroup))));
    }

    /// <summary>Get user count statistics broken down by role.</summary>
    [HttpGet("stats")]
    public async Task<ActionResult<ApiResponse<UserStatsDto>>> GetStats(CancellationToken ct)
    {
        var byRole = await _users.GetCountsByRoleAsync(ct);
        var total = await _users.CountAsync(ct: ct);
        var active = await _users.CountAsync(u => u.Status == UserStatus.Active, ct);
        var byRoleStr = byRole.ToDictionary(kv => kv.Key.ToString(), kv => kv.Value);
        return Ok(ApiResponse<UserStatsDto>.Ok(new UserStatsDto(total, active, byRoleStr)));
    }

    private static UserDetailDto MapToDetail(User u) => new(
        u.Id, u.Name, u.Email, u.Phone, u.Avatar, u.Role, u.Status,
        u.LinkedProfileId, u.LinkedProfileType, u.LastLoginAt, u.CreatedAt,
        u.UserPermissions.Select(up => new PermissionDto(up.Permission.Id, up.Permission.Code, up.Permission.Description, up.Permission.PermissionGroup)));
}
