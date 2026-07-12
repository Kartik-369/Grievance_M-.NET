using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using grievance_b.Data;
using grievance_b.Models;

namespace grievance_b.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GrievanceHistoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GrievanceHistoryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllHistory()
        {
            return Ok(await _context.GrievanceStatusHistory.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetHistoryById(int id)
        {
            var history = await _context.GrievanceStatusHistory.FindAsync(id);
            return history == null ? NotFound() : Ok(history);
        }
    }
}