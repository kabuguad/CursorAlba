using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Service.Contracts;

public static class ClaimsPrincipalExtensions
{
    public static int GetUserId(this ClaimsPrincipal user) =>
        int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? throw new UnauthorizedAccessException("User ID claim not found."));

    public static string GetUserRole(this ClaimsPrincipal user) =>
        user.FindFirst(ClaimTypes.Role)?.Value
            ?? throw new UnauthorizedAccessException("Role claim not found.");

    public static bool IsInAnyRole(this ClaimsPrincipal user, params string[] roles) =>
        roles.Any(user.IsInRole);
}
