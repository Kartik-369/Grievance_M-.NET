using FluentValidation;
using grievance_b.Common;
using grievance_b.Data;
using grievance_b.DTOs;
using grievance_b.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using grievance_b.Services;

namespace grievance_b.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IValidator<UserDTO> _validator;
        private readonly TokenService _tokenService;
        private readonly IFileService _fileService;

        public UserController(AppDbContext context, IValidator<UserDTO> validator, TokenService tokenService, IFileService fileService)
        {
            _context = context;
            _validator = validator;
            _tokenService = tokenService;
            _fileService = fileService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            try
            {
                var user = await _context.Users.Include(u => u.Roles)
                                               .SingleOrDefaultAsync(u =>
                                               u.Email == dto.Email &&
                                               u.Password == dto.Password);
                if (user == null)
                {
                    return Unauthorized(new ApiResponse<object> { Success = false, Message = "Invalid Email or password" });
                }
                var token = _tokenService.GenerateToken(user);
                return Ok(new ApiResponse<object> { Success = true, Message = "Login Successful", Data = new { Token = token } });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object> { Success = false, Message = "Something went wrong: " + ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users.Include(u => u.Roles)
                .Select(u => new UserDTO
                {
                    UserId = u.UserId,
                    RoleId = u.RoleId,
                    RoleName = u.Roles.RoleName,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    Password = u.Password,
                    IsActive = u.IsActive,
                    ProfilePicturePath = u.ProfilePicturePath
                }).ToListAsync();
            return Ok(new ApiResponse<List<UserDTO>> { Success = true, Message = "Users Retrieved Successfully", Data = users });
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.Include(u => u.Roles).FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null) return NotFound(new ApiResponse<object> { Success = false, Message = "User Not Found" });

            var userDto = new UserDTO { UserId = user.UserId, RoleId = user.RoleId, RoleName = user.Roles.RoleName, FirstName = user.FirstName, LastName = user.LastName, Email = user.Email, Password = user.Password, IsActive = user.IsActive, ProfilePicturePath = user.ProfilePicturePath };
            return Ok(new ApiResponse<UserDTO> { Success = true, Message = "User Found", Data = userDto });
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] UserDTO userDto)
        {
            var validationResult = await _validator.ValidateAsync(userDto);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ApiResponse<object> { Success = false, Message = "Validation Failed", Data = validationResult.Errors });
            }

            string? uploadedPath = string.Empty;
            if (userDto.ProfilePicture != null)
            {
                uploadedPath = await _fileService.UploadFileAsync(userDto.ProfilePicture, "Users");
            }

            var user = new User { RoleId = userDto.RoleId, FirstName = userDto.FirstName, LastName = userDto.LastName, Email = userDto.Email, Password = userDto.Password, IsActive = userDto.IsActive, ProfilePicturePath = uploadedPath ?? string.Empty };
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            
            userDto.UserId = user.UserId;
            userDto.ProfilePicturePath = user.ProfilePicturePath;
            return Ok(new ApiResponse<UserDTO> { Success = true, Message = "User Created Successfully", Data = userDto });
        }

        [HttpPut("{id:int}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update(int id, [FromForm] UserDTO userDto)
        {
            if (id != userDto.UserId) return BadRequest(new ApiResponse<object> { Success = false, Message = "ID Mismatch" });
            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null) return NotFound(new ApiResponse<object> { Success = false, Message = "User Not Found" });

            if (userDto.ProfilePicture != null && userDto.ProfilePicture.Length > 0)
            {
                _fileService.DeleteFile(existingUser.ProfilePicturePath);
                existingUser.ProfilePicturePath = await _fileService.UploadFileAsync(userDto.ProfilePicture, "Users");
                userDto.ProfilePicturePath = existingUser.ProfilePicturePath;
            }

            existingUser.RoleId = userDto.RoleId;
            existingUser.FirstName = userDto.FirstName;
            existingUser.LastName = userDto.LastName;
            existingUser.Email = userDto.Email;
            if (!string.IsNullOrWhiteSpace(userDto.Password))
            {
                existingUser.Password = userDto.Password;
            }
            existingUser.IsActive = userDto.IsActive;
            
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<UserDTO> { Success = true, Message = "User Updated Successfully", Data = userDto });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id, [FromQuery] bool deleteFileOnly = false)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new ApiResponse<object> { Success = false, Message = "User Not Found" });

            if (deleteFileOnly)
            {
                if (string.IsNullOrEmpty(user.ProfilePicturePath))
                    return BadRequest(new ApiResponse<object> { Success = false, Message = "No document exists for this user." });

                _fileService.DeleteFile(user.ProfilePicturePath);
                user.ProfilePicturePath = string.Empty;
                await _context.SaveChangesAsync();

                return Ok(new ApiResponse<object> { Success = true, Message = "Profile Picture Deleted Successfully" });
            }

            _fileService.DeleteFile(user.ProfilePicturePath);
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok(new ApiResponse<object> { Success = true, Message = "User Deleted Successfully" });
        }
    }
}
