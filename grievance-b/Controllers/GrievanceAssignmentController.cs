using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using grievance_b.Data;
using grievance_b.Models;

namespace grievance_b.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GrievanceAssignmentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GrievanceAssignmentController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAssignments()
        {
            return Ok(await _context.GrievanceAssignments.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAssignmentById(int id)
        {
            var assignment = await _context.GrievanceAssignments.FindAsync(id);
            return assignment == null ? NotFound() : Ok(assignment);
        }
    }
}