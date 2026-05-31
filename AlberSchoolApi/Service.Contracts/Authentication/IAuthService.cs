using DTOs.User;

namespace Service.Contracts;

public interface IAuthenticationService
{
    Task<UserResponseDto> RegisterUserAsync(UserRegistrationDto dto);
    Task<string?> AuthenticateUserAsync(UserLoginDto dto);
    Task<UserResponseDto?> GetUserByEmailAsync(string email);
}
