using FluentValidation;
using grievance_b.Common;
using grievance_b.Data;
using grievance_b.DTOs;
using grievance_b.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace grievance_b.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IValidator<UserDTO> _validator;
        public UserController(AppDbContext context, IValidator<UserDTO> validator)
        {
            _context = context;
            _validator = validator;
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
        public async Task<IActionResult> Create(UserDTO userDto)
        {
            var validationResult = await _validator.ValidateAsync(userDto);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ApiResponse<object> { Success = false, Message = "Validation Failed", Data = validationResult.Errors });
            }

            var user = new User { RoleId = userDto.RoleId, FirstName = userDto.FirstName, LastName = userDto.LastName, Email = userDto.Email, Password = userDto.Password, IsActive = userDto.IsActive, ProfilePicturePath = userDto.ProfilePicturePath };
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            userDto.UserId = user.UserId;
            return Ok(new ApiResponse<UserDTO> { Success = true, Message = "User Created Successfully", Data = userDto });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, UserDTO userDto)
        {
            if (id != userDto.UserId) return BadRequest(new ApiResponse<object> { Success = false, Message = "ID Mismatch" });
            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null) return NotFound(new ApiResponse<object> { Success = false, Message = "User Not Found" });

            existingUser.RoleId = userDto.RoleId;
            existingUser.FirstName = userDto.FirstName;
            existingUser.LastName = userDto.LastName;
            existingUser.Email = userDto.Email;
            existingUser.Password = userDto.Password;
            existingUser.IsActive = userDto.IsActive;
            existingUser.ProfilePicturePath = userDto.ProfilePicturePath;
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<UserDTO> { Success = true, Message = "User Updated Successfully", Data = userDto });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new ApiResponse<object> { Success = false, Message = "User Not Found" });
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok(new ApiResponse<object> { Success = true, Message = "User Deleted Successfully" });
        }
    }
}