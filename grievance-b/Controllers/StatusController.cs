using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using grievance_b.Data;
using grievance_b.Models;
using grievance_b.DTOs;
using grievance_b.Common;
using FluentValidation;

namespace grievance_b.Controllers
{
    [ApiController]
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    public class StatusController : ControllerBase
    {
        
        private readonly AppDbContext _context;
        private readonly IValidator<StatusDTO> _validator;


        public StatusController(AppDbContext context,IValidator<StatusDTO> validator)
        {
            _validator = validator;
            _context = context;
        }
        

        
        // GET: api/status
        [HttpGet]
        public async Task<IActionResult> GetAllStatuses()
        {
            var statuses = await _context.Status
                .Select(x => new StatusDTO
                {
                    StatusID = x.StatusID,
                    StatusName = x.StatusName,
                    StatusCssClass = x.StatusCssClass
                })
                .ToListAsync();

            return Ok(new ApiResponse<List<StatusDTO>>
            {
                Success = true,
                Message = "Statuses Retrieved Successfully",
                Data = statuses
            });
        }
        

        
        // GET: api/status/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetStatusById(int id)
        {
            var status = await _context.Status.FindAsync(id);

            if (status == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Status Not Found",
                    Errors = new List<string> { "No Record of such Status" }
                });
            }

            var statusDto = new StatusDTO
            {
                StatusID = status.StatusID,
                StatusName = status.StatusName,
                StatusCssClass = status.StatusCssClass
            };

            return Ok(new ApiResponse<StatusDTO>
            {
                Success = true,
                Message = "Status Found",
                Data = statusDto
            });
        }
        

        
        [HttpPost]
        public async Task<IActionResult> Create(StatusDTO status)
        {
            var validationResult = await _validator.ValidateAsync(status);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Validation Failed",
                    Errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList()
                });
            }
            var ent = new Status()
            {
                StatusName = status.StatusName,
                StatusCssClass = status.StatusCssClass
            };

            _context.Status.Add(ent);
            await _context.SaveChangesAsync();

            status.StatusID = ent.StatusID;

            return Ok(new ApiResponse<StatusDTO>
            {
                Success = true,
                Message = "Status Added Successfully",
                Data = status
            });
        }
        

        
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, StatusDTO status)
        {
            if (id != status.StatusID)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "ID Mismatch",
                    Errors = new List<string> { "The ID in the URL does not match the body." }
                });
            }

            var validationResult = await _validator.ValidateAsync(status);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Validation Failed",
                    Errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList()
                });
            }

            var existingStatus = await _context.Status.FindAsync(id);
            if (existingStatus == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Status Not Found",
                    Errors = new List<string> { "No Record of such Status" }
                });
            }

            existingStatus.StatusName = status.StatusName;
            existingStatus.StatusCssClass = status.StatusCssClass;

            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Status Updated Successfully"
            });
        }
        

        
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var status = await _context.Status.FindAsync(id);
            if (status == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Status Not Found",
                    Errors = new List<string> { "No Record of such Status" }
                });
            }

            _context.Status.Remove(status);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Status Deleted Successfully"
            });
        }
        
    }
}
