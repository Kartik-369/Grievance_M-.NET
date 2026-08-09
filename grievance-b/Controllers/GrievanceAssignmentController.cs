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
        #region Dependency Injected
        private readonly AppDbContext _context;

        public GrievanceAssignmentController(AppDbContext context)
        {
            _context = context;
        }
        #endregion

        #region Get All Grievance Assignments
        // GET: api/grievanceassignment
        [HttpGet]
        public async Task<IActionResult> GetAllGrievanceAssignments()
        {
            var assignments = await _context.GrievanceAssignments.ToListAsync();
            return Ok(assignments);
        }
        #endregion

        #region Get Grievance Assignment By ID
        // GET: api/grievanceassignment/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGrievanceAssignmentById(int id)
        {
            var assignment = await _context.GrievanceAssignments.FindAsync(id);

            if (assignment == null)
            {
                return NotFound();
            }

            return Ok(assignment);
        }
        #endregion

        #region Create Grievance Assignment
        [HttpPost]
        public async Task<IActionResult> Create(GrievanceAssignments assignment)
        {
            await _context.GrievanceAssignments.AddAsync(assignment);
            await _context.SaveChangesAsync();
            return Ok();
        }
        #endregion

        #region Update Grievance Assignment
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, GrievanceAssignments assignment)
        {
            if (id != assignment.AssignmentId)
            {
                return BadRequest();
            }
            
            var existingAssignment = await _context.GrievanceAssignments.FindAsync(id);
            if (existingAssignment == null)
            {
                return NotFound();
            }

            existingAssignment.GrievanceId = assignment.GrievanceId;
            existingAssignment.AssignedTo = assignment.AssignedTo;
            existingAssignment.AssignedAt = assignment.AssignedAt;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        #endregion
        #region Delete Grievance Assignment
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var assignment = await _context.GrievanceAssignments.FindAsync(id);
            if (assignment == null)
            {
                return NotFound();
            }

            _context.GrievanceAssignments.Remove(assignment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        #endregion
    }
}