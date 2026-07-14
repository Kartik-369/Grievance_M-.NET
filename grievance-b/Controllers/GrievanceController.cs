using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using grievance_b.Data;
using grievance_b.Models;

namespace grievance_b.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GrievanceController : ControllerBase
    {
        #region Dependency Injected
        private readonly AppDbContext _context;

        public GrievanceController(AppDbContext context)
        {
            _context = context;
        }
        #endregion

        #region Get All Grievances
        // GET: api/grievance
        [HttpGet]
        public async Task<IActionResult> GetAllGrievances()
        {
            var grievances = await _context.Grievances.ToListAsync();
            return Ok(grievances);
        }
        #endregion

        #region Get Grievance By ID
        // GET: api/grievance/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGrievanceById(int id)
        {
            var grievance = await _context.Grievances.FindAsync(id);

            if (grievance == null)
            {
                return NotFound();
            }

            return Ok(grievance);
        }
        #endregion
    }
}