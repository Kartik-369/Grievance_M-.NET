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
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GrievanceHistoryController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IValidator<GrievanceStatusHistoryDTO> _validator;

        public GrievanceHistoryController(AppDbContext context, IValidator<GrievanceStatusHistoryDTO> validator)
        {
            _context = context;
            _validator = validator;
        }
        

        
        // GET: api/grievancehistory
        [HttpGet]
        public async Task<IActionResult> GetAllGrievanceHistory()
        {
            var histories = await _context.GrievanceStatusHistory
                .Include(x => x.StatusNavigation)
                .Select(x => new GrievanceStatusHistoryDTO
                {
                    StatusHistoryId = x.StatusHistoryId,
                    GrievanceId = x.GrievanceId,
                    Status = x.Status,
                    StatusName = x.StatusNavigation.StatusName,
                    Remarks = x.Remarks,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedOn = x.UpdatedOn
                })
                .ToListAsync();

            return Ok(histories);
        }
        

        
        // GET: api/grievancehistory/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetGrievanceHistoryById(int id)
        {
            var history = await _context.GrievanceStatusHistory.FindAsync(id);

            if (history == null)
            {
                return NotFound();
            }

            return Ok(history);
        }
        

        
        [HttpPost]
        public async Task<IActionResult> Create(GrievanceStatusHistoryDTO historyDto)
        {
            var validationResult = await _validator.ValidateAsync(historyDto);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ApiResponse<object> { Success = false, Message = "Validation Failed", Data = null, Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList() });
            }
            
            var history = new GrievanceStatusHistory
            {
                GrievanceId = historyDto.GrievanceId,
                Status = historyDto.Status,
                Remarks = historyDto.Remarks,
                UpdatedBy = historyDto.UpdatedBy,
                UpdatedOn = historyDto.UpdatedOn
            };

            await _context.GrievanceStatusHistory.AddAsync(history);
            await _context.SaveChangesAsync();
            return Ok();
        }
        
    }
}
