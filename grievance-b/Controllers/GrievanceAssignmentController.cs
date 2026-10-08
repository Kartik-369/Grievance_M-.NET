using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using grievance_b.Data;
using grievance_b.Models;
using grievance_b.Common;
using FluentValidation;
using grievance_b.DTOs;

namespace grievance_b.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GrievanceAssignmentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IValidator<GrievanceAssignmentDTO> _validator;

        public GrievanceAssignmentController(AppDbContext context, IValidator<GrievanceAssignmentDTO> validator)
        {
            _context = context;
            _validator = validator;
        }
        

        
        // GET: api/grievanceassignment
        [HttpGet]
        public async Task<IActionResult> GetAllGrievanceAssignments()
        {
            var assignments = await _context.GrievanceAssignments
                .Include(x => x.Grievances)
                .Select(x => new GrievanceAssignmentDTO
                {
                    AssignmentId = x.AssignmentId,
                    GrievanceId = x.Grievances.GrievanceId,
                    GrievanceTitle = x.Grievances.Title,
                    AssignedTo = x.AssignedTo,
                    AssignedAt = x.AssignedAt
                })
                .ToListAsync();

            return Ok(assignments);
        }
        

        
        // GET: api/grievanceassignment/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetGrievanceAssignmentById(int id)
        {
            var assignment = await _context.GrievanceAssignments.FindAsync(id);

            if (assignment == null)
            {
                return NotFound();
            }

            return Ok(assignment);
        }
        

        
        [HttpPost]
        public async Task<IActionResult> Create(GrievanceAssignmentDTO assignmentDto)
        {
            var validationResult = await _validator.ValidateAsync(assignmentDto);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ApiResponse<object> { Success = false, Message = "Validation Failed", Data = null, Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList() });
            }
            
            var assignment = new GrievanceAssignments
            {
                GrievanceId = assignmentDto.GrievanceId,
                AssignedTo = assignmentDto.AssignedTo,
                AssignedAt = assignmentDto.AssignedAt
            };

            await _context.GrievanceAssignments.AddAsync(assignment);
            await _context.SaveChangesAsync();
            return Ok();
        }
        

        
        [HttpDelete("{id:int}")]
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
        
    }
}
