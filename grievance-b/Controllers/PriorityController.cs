using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using grievance_b.Data;
using grievance_b.Models;
using grievance_b.DTOs;
using grievance_b.Common;
using FluentValidation;
using Asp.Versioning;

namespace grievance_b.Controllers
{
    [ApiController]
    [Authorize(Roles = "Admin")]
    [ApiVersion("1.0")]
    [ApiVersion("2.0")]
    [Route("api/[controller]")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class PriorityController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IValidator<PriorityDTO> _validator;

        public PriorityController(AppDbContext context, IValidator<PriorityDTO> validator)
        {
            _context = context;
            _validator = validator;
        }
        

        
        // GET: api/priority
        // GET: api/priority
        [HttpGet]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> GetAllPriorities()
        {
            var priorities = await _context.Priority
                .Select(x => new PriorityDTO
                {
                    PriorityId = x.PriorityId,
                    PriorityName = x.PriorityName,
                    PriorityCssClass = x.PriorityCssClass
                })
                .ToListAsync();

            return Ok(new ApiResponse<List<PriorityDTO>>
            {
                Success = true,
                Message = "Priorities Retrieved Successfully (v1)",
                Data = priorities
            });
        }

        [HttpGet]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> GetAllPrioritiesV2()
        {
            var priorities = await _context.Priority
                .Select(x => new 
                {
                    Id = x.PriorityId,
                    Name = x.PriorityName,
                    BadgeStyle = x.PriorityCssClass,
                    AdditionalInfo = "This is from API Version 2.0!"
                })
                .ToListAsync();

            return Ok(new 
            {
                Success = true,
                Message = "Priorities Retrieved Successfully (v2)",
                Data = priorities,
                Version = "2.0"
            });
        }
        

        
        // GET: api/priority/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetPriorityById(int id)
        {
            var priority = await _context.Priority.FindAsync(id);

            if (priority == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Priority Not Found",
                    Errors = new List<string> { "No Record of such Priority" }
                });
            }

            var priorityDto = new PriorityDTO
            {
                PriorityId = priority.PriorityId,
                PriorityName = priority.PriorityName,
                PriorityCssClass = priority.PriorityCssClass
            };

            return Ok(new ApiResponse<PriorityDTO>
            {
                Success = true,
                Message = "Priority Found",
                Data = priorityDto
            });
        }
        

        
        [HttpPost]
        public async Task<IActionResult> Create(PriorityDTO priority)
        {
            var validationResult = await _validator.ValidateAsync(priority);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ApiResponse<object> { Success = false, Message = "Validation Failed", Data = null, Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList() });
            }

            var ent = new Priority()
            {
                PriorityName = priority.PriorityName,
                PriorityCssClass = priority.PriorityCssClass
            };

            _context.Priority.Add(ent);
            await _context.SaveChangesAsync();

            priority.PriorityId = ent.PriorityId;

            return Ok(new ApiResponse<PriorityDTO>
            {
                Success = true,
                Message = "Priority Added Successfully",
                Data = priority
            });
        }
        

        
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, PriorityDTO priority)
        {
            if (id != priority.PriorityId)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "ID Mismatch",
                    Errors = new List<string> { "The ID in the URL does not match the body." }
                });
            }

            var validationResult = await _validator.ValidateAsync(priority);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ApiResponse<object> { Success = false, Message = "Validation Failed", Data = null, Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList() });
            }

            var existingPriority = await _context.Priority.FindAsync(id);
            if (existingPriority == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Priority Not Found",
                    Errors = new List<string> { "No Record of such Priority" }
                });
            }

            existingPriority.PriorityName = priority.PriorityName;
            existingPriority.PriorityCssClass = priority.PriorityCssClass;

            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Priority Updated Successfully"
            });
        }
        

        
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var priority = await _context.Priority.FindAsync(id);
            if (priority == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Priority Not Found",
                    Errors = new List<string> { "No Record of such Priority" }
                });
            }

            _context.Priority.Remove(priority);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Priority Deleted Successfully"
            });
        }
        
    }
}
