using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Service;

public class TokenService : Service.Contracts.Authentication.ITokenService
{
    private readonly string _secretKey;
    private readonly string _validIssuer;
    private readonly string _validAudience;

    public TokenService(IConfiguration configuration)
    {
        _secretKey = configuration["JwtSettings:SecretKey"] ?? "default_secret_key_change_in_production_12345";
        _validIssuer = configuration["JwtSettings:ValidIssuer"] ?? "AlbaApi";
        _validAudience = configuration["JwtSettings:ValidAudience"] ?? "AlbaApiClient";
    }

    public string GenerateToken(Entities.Models.User.ApplicationUser user, string role)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Role, role),
            new(ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _validIssuer,
            audience: _validAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(4),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
