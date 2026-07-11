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
        private readonly AppDbContext _context;

        public PriorityController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPriorities()
        {
            return Ok(await _context.Priority.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPriorityById(int id)
        {
            var priority = await _context.Priority.FindAsync(id);
            return priority == null ? NotFound() : Ok(priority);
        }
    }
}