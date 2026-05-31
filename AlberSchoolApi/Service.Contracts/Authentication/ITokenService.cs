namespace Service.Contracts.Authentication;

public interface ITokenService
{
    string GenerateToken(Entities.Models.User.ApplicationUser user, string role);
}
