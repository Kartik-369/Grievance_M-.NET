using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using grievance_b.Data;
using grievance_b.Models;
using grievance_b.DTOs;
using grievance_b.Common;
using FluentValidation;

namespace grievance_b.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class RoleController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IValidator<RoleDTO> _validator;

        public RoleController(AppDbContext context, IValidator<RoleDTO> validator)
        {
            _context = context;
            _validator = validator;
        }
        

        
        // GET: api/role
        [HttpGet]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _context.Roles
                .Select(x => new RoleDTO
                {
                    RoleId = x.RoleId,
                    RoleName = x.RoleName,
                    Description = x.Description
                })
                .ToListAsync();

            return Ok(new ApiResponse<List<RoleDTO>>
            {
                Success = true,
                Message = "Roles Retrieved Successfully",
                Data = roles
            });
        }
        

        
        // GET: api/role/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetRoleById(int id)
        {
            var role = await _context.Roles.FindAsync(id);

            if (role == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Role Not Found",
                    Errors = new List<string> { "No Record of such Role" }
                });
            }

            var roleDto = new RoleDTO
            {
                RoleId = role.RoleId,
                RoleName = role.RoleName,
                Description = role.Description
            };

            return Ok(new ApiResponse<RoleDTO>
            {
                Success = true,
                Message = "Role Found",
                Data = roleDto
            });
        }
        

        
        [HttpPost]
        public async Task<IActionResult> Create(RoleDTO role)
        {
            var validationResult = await _validator.ValidateAsync(role);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ApiResponse<object> { Success = false, Message = "Validation Failed", Data = null, Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList() });
            }

            var ent = new Roles()
            {
                RoleName = role.RoleName,
                Description = role.Description
            };

            _context.Roles.Add(ent);
            await _context.SaveChangesAsync();

            role.RoleId = ent.RoleId;

            return Ok(new ApiResponse<RoleDTO>
            {
                Success = true,
                Message = "Role Added Successfully",
                Data = role
            });
        }
        

        
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, RoleDTO role)
        {
            if (id != role.RoleId)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "ID Mismatch",
                    Errors = new List<string> { "The ID in the URL does not match the body." }
                });
            }

            var validationResult = await _validator.ValidateAsync(role);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ApiResponse<object> { Success = false, Message = "Validation Failed", Data = null, Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList() });
            }

            var existingRole = await _context.Roles.FindAsync(id);
            if (existingRole == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Role Not Found",
                    Errors = new List<string> { "No Record of such Role" }
                });
            }

            existingRole.RoleName = role.RoleName;
            existingRole.Description = role.Description;

            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Role Updated Successfully"
            });
        }
        

        
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Role Not Found",
                    Errors = new List<string> { "No Record of such Role" }
                });
            }

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Role Deleted Successfully"
            });
        }
        

        
        [HttpGet("dropdown")]
        public async Task<IActionResult> GetAllRolesD()
        {
            var roles = await _context.Roles
                .Select(x => new RoleDTO
                {
                    RoleId = x.RoleId,
                    RoleName = x.RoleName,
                })
                .ToListAsync();

            return Ok(new ApiResponse<List<RoleDTO>>
            {
                Success = true,
                Message = "Roles Retrieved Successfully",
                Data = roles
            });
        }
        
    }
}
