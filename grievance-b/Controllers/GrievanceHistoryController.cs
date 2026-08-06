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
        #region Dependency Injected
        private readonly AppDbContext _context;

        public GrievanceHistoryController(AppDbContext context)
        {
            _context = context;
        }
        #endregion

        #region Get All Grievance Status History
        // GET: api/grievancehistory
        [HttpGet]
        public async Task<IActionResult> GetAllGrievanceHistory()
        {
            var histories = await _context.GrievanceStatusHistory.ToListAsync();
            return Ok(histories);
        }
        #endregion

        #region Get Grievance Status History By ID
        // GET: api/grievancehistory/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGrievanceHistoryById(int id)
        {
            var history = await _context.GrievanceStatusHistory.FindAsync(id);

            if (history == null)
            {
                return NotFound();
            }

            return Ok(history);
        }
        #endregion

        #region Create Grievance Status History
        [HttpPost]
        public async Task<IActionResult> Create(GrievanceStatusHistory history)
        {
            await _context.GrievanceStatusHistory.AddAsync(history);
            await _context.SaveChangesAsync();
            return Ok();
        }
        #endregion

        #region Update Grievance Status History
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, GrievanceStatusHistory history)
        {
            if (id != history.StatusHistoryId)
            {
                return BadRequest();
            }
            
            var existingHistory = await _context.GrievanceStatusHistory.FindAsync(id);
            if (existingHistory == null)
            {
                return NotFound();
            }

            existingHistory.GrievanceId = history.GrievanceId;
            existingHistory.Status = history.Status;
            existingHistory.Remarks = history.Remarks;
            existingHistory.UpdatedBy = history.UpdatedBy;
            existingHistory.UpdatedOn = history.UpdatedOn;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        #endregion
        #region Delete Grievance Status History
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var history = await _context.GrievanceStatusHistory.FindAsync(id);
            if (history == null)
            {
                return NotFound();
            }

            _context.GrievanceStatusHistory.Remove(history);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        #endregion
    }
}