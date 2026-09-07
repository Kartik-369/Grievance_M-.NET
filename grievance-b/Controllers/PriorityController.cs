using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using grievance_b.Data;
using grievance_b.Models;
using grievance_b.DTOs;
using grievance_b.Common;

namespace grievance_b.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PriorityController : ControllerBase
    {
        #region Dependency Injected
        private readonly AppDbContext _context;

        public PriorityController(AppDbContext context)
        {
            _context = context;
        }
        #endregion

        #region Get All Priorities
        // GET: api/priority
        [HttpGet]
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
                Message = "Priorities Retrieved Successfully",
                Data = priorities
            });
        }
        #endregion

        #region Get Priority By ID
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
        #endregion

        #region Create Priority
        [HttpPost]
        public async Task<IActionResult> Create(PriorityDTO priority)
        {
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
        #endregion

        #region Update Priority
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
        #endregion

        #region Delete Priority
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
        #endregion
    }
}