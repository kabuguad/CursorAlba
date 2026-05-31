using AutoMapper;
using Contracts.Repositories;
using DTOs.User;
using Entities.Exceptions;
using Entities.Models.User;
using LoggerService;
using Microsoft.AspNetCore.Identity;
using Service.Contracts;
using Service.Contracts.Authentication;
using System.Security.Claims;

namespace Service;

public class AuthenticationService : IAuthenticationService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly ILoggerManager _logger;
    private readonly IMapper _mapper;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole<int>> _roleManager;
    private readonly ITokenService _tokenService;
    private readonly SignInManager<ApplicationUser> _signInManager;

    public AuthenticationService(
        IRepositoryManager repositoryManager,
        ILoggerManager logger,
        IMapper mapper,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole<int>> roleManager,
        ITokenService tokenService,
        SignInManager<ApplicationUser> signInManager)
    {
        _repositoryManager = repositoryManager;
        _logger = logger;
        _mapper = mapper;
        _userManager = userManager;
        _roleManager = roleManager;
        _tokenService = tokenService;
        _signInManager = signInManager;
    }

    public async Task<UserResponseDto> RegisterUserAsync(UserRegistrationDto dto)
    {
        _logger.LogInfo($"Registering user: {dto.Email}");

        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
            throw new BadRequestException("Email already registered.");

        if (!await _roleManager.RoleExistsAsync(dto.Role))
            await _roleManager.CreateAsync(new IdentityRole<int>(dto.Role));

        var user = _mapper.Map<ApplicationUser>(dto);
        user.UserName = dto.Email;
        user.SecurityStamp = Guid.NewGuid().ToString();
        user.EmailConfirmed = true;

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            throw new BadRequestException("User creation failed.", result.Errors.Select(e => e.Description).ToArray());

        await _userManager.AddToRoleAsync(user, dto.Role);

        var response = _mapper.Map<UserResponseDto>(user);
        response.Role = dto.Role;
        return response;
    }

    public async Task<string?> AuthenticateUserAsync(UserLoginDto dto)
    {
        _logger.LogInfo($"Authenticating: {dto.Email}");

        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null) return null;

        var passwordOk = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!passwordOk) return null;

        var roles = await _userManager.GetRolesAsync(user);
        return _tokenService.GenerateToken(user, roles.FirstOrDefault() ?? "Student");
    }

    public async Task<UserResponseDto?> GetUserByEmailAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) return null;

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "Student";

        int? linkedId = null;
        try
        {
            if (role == "Student")
            {
                var student = await _repositoryManager.StudentRepository.GetByUserIdAsync(user.Id, false);
                linkedId = student?.Id;
            }
            else if (role == "Teacher")
            {
                var teacher = await _repositoryManager.TeacherRepository.GetByUserIdAsync(user.Id, false);
                linkedId = teacher?.Id;
            }
            else if (role == "Parent")
            {
                var parent = await _repositoryManager.ParentRepository.GetByUserIdAsync(user.Id, false);
                linkedId = parent?.Id;
            }
        }
        catch { }

        return new UserResponseDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email ?? string.Empty,
            PhoneNumber = user.PhoneNumber,
            Role = role,
            LinkedId = linkedId
        };
    }
}
