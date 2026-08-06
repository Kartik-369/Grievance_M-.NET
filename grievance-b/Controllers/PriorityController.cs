using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using grievance_b.Data;
using grievance_b.Models;

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
            var priorities = await _context.Priority.ToListAsync();
            return Ok(priorities);
        }
        #endregion

        #region Get Priority By ID
        // GET: api/priority/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPriorityById(int id)
        {
            var priority = await _context.Priority.FindAsync(id);

            if (priority == null)
            {
                return NotFound();
            }

            return Ok(priority);
        }
        #endregion

        #region Create Priority
        [HttpPost]
        public async Task<IActionResult> Create(Priority priority)
        {
            await _context.Priority.AddAsync(priority);
            await _context.SaveChangesAsync();
            return Ok();
        }
        #endregion

        #region Update Priority
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Priority priority)
        {
            if (id != priority.PriorityId)
            {
                return BadRequest();
            }

            var existingPriority = await _context.Priority.FindAsync(id);
            if (existingPriority == null)
            {
                return NotFound();
            }

            existingPriority.PriorityName = priority.PriorityName;
            existingPriority.PriorityCssClass = priority.PriorityCssClass;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        #endregion
        #region Delete Priority
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var priority = await _context.Priority.FindAsync(id);
            if (priority == null)
            {
                return NotFound();
            }

            _context.Priority.Remove(priority);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        #endregion
    }
}