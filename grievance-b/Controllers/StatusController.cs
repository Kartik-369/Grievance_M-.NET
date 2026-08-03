using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using grievance_b.Data;
using grievance_b.Models;

namespace grievance_b.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        #region Dependency Injected
        private readonly AppDbContext _context;

        public StatusController(AppDbContext context)
        {
            _context = context;
        }
        #endregion

        #region Get All Statuses
        // GET: api/status
        [HttpGet]
        public async Task<IActionResult> GetAllStatuses()
        {
            var statuses = await _context.Status.ToListAsync();
            return Ok(statuses);
        }
        #endregion

        #region Get Status By ID
        // GET: api/status/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStatusById(int id)
        {
            var status = await _context.Status.FindAsync(id);

            if (status == null)
            {
                return NotFound();
            }

            return Ok(status);
        }
        #endregion

        #region Create Status
        [HttpPost]
        public async Task<IActionResult> Create(Status status)
        {
            await _context.Status.AddAsync(status);
            await _context.SaveChangesAsync();
            return Ok();
        }
        #endregion

        #region Update Status
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Status status)
        {
            if (id != status.StatusID)
            {
                return BadRequest();
            }
            
            var existingStatus = await _context.Status.FindAsync(id);
            if (existingStatus == null)
            {
                return NotFound();
            }

            existingStatus.StatusName = status.StatusName;
            existingStatus.StatusCssClass = status.StatusCssClass;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        #endregion
        #region Delete Status
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var status = await _context.Status.FindAsync(id);
            if (status == null)
            {
                return NotFound();
            }

            _context.Status.Remove(status);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        #endregion
    }
}