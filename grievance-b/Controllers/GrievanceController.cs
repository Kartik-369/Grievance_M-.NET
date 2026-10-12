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
    public class GrievanceController : ControllerBase
    {
        
        private readonly AppDbContext _context;
        private readonly IValidator<GrievanceDTO> _validator;

        public GrievanceController(AppDbContext context, IValidator<GrievanceDTO> validator)
        {
            _context = context;
            _validator = validator;
        }
        

        
        // GET: api/grievance
        [HttpGet]
        public async Task<IActionResult> GetAllGrievances(
            int pageNumber = 1, 
            int pageSize = 10,
            int? categoryId = null,
            int? statusId = null,
            int? priorityId = null,
            string? searchTitle = null)
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                {
                    return BadRequest(new ApiResponse<object> { Success = false, Message = "Page number and page size must be greater than 0." });
                }

                var query = _context.Grievances.AsQueryable();

                if (categoryId.HasValue)
                {
                    query = query.Where(g => g.CategoryId == categoryId.Value);
                }

                if (statusId.HasValue)
                {
                    query = query.Where(g => g.StatusId == statusId.Value);
                }

                if (priorityId.HasValue)
                {
                    query = query.Where(g => g.PriorityId == priorityId.Value);
                }
                
                if (!string.IsNullOrWhiteSpace(searchTitle))
                {
                    query = query.Where(g => g.Title.Contains(searchTitle));
                }

                var totalCount = await query.CountAsync();
                
                var items = await query
                    .Include(x => x.GrievanceCategories)
                    .OrderByDescending(g => g.GrievanceId)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(x => new GrievanceDTO
                    {
                        GrievanceId = x.GrievanceId,
                        Title = x.Title,
                        Description = x.Description,
                        RaisedBy = x.RaisedBy,
                        CategoryId = x.CategoryId,
                        CategoryName = x.GrievanceCategories.CategoryName,
                        StatusId = x.StatusId,
                        PriorityId = x.PriorityId
                    })
                    .ToListAsync();

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Grievances Retrieved Successfully",
                    Data = new
                    {
                        items,
                        pageNumber,
                        pageSize,
                        totalCount,
                        totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Error getting grievances: " + ex.Message
                });
            }
        }
        

        
        // GET: api/grievance/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetGrievanceById(int id)
        {
            var grievance = await _context.Grievances
                .Include(x => x.GrievanceCategories) // Include related entity
                .FirstOrDefaultAsync(x => x.GrievanceId == id); // Use FirstOrDefaultAsync with a condition

            if (grievance == null)
            {
                return NotFound(new ApiResponse<object>{
                   Success=false,
                   Message="Grievance Not Found",
                   Errors=new List<string>{"No Record of such Grievanc"}
                });
            }

            var grievanceDto = new GrievanceDTO
            {
                GrievanceId = grievance.GrievanceId,
                Title = grievance.Title,
                Description = grievance.Description,
                RaisedBy = grievance.RaisedBy,
                CategoryId = grievance.CategoryId,
                CategoryName = grievance.GrievanceCategories.CategoryName,
                StatusId = grievance.StatusId,
                PriorityId = grievance.PriorityId
            };

            return Ok(new ApiResponse<GrievanceDTO>{
                Success=true,
                Message="Grievance Found",
                Data=grievanceDto
            });
        }
        

        
        [HttpPost]
        public async Task<IActionResult> Create(GrievanceDTO grievance)
        {
            var validationResult = await _validator.ValidateAsync(grievance);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ApiResponse<object> { Success = false, Message = "Validation Failed", Data = null, Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList() });
            }

            var gri=new Grievances(){
                GrievanceId=grievance.GrievanceId,
                Title=grievance.Title,
                Description=grievance.Description,
                RaisedBy=grievance.RaisedBy,
                CategoryId=grievance.CategoryId,
                StatusId=grievance.StatusId,
                PriorityId=grievance.PriorityId
            };
            _context.Grievances.Add(gri);
            await _context.SaveChangesAsync();
            return Ok(new ApiResponse<Grievances>
            {
                Success = true,
                Message = "grievance Added Successfully",
                Data = gri
            });
        }
        

        
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, GrievanceDTO grievance)
        {
            if (id != grievance.GrievanceId)
            {
                return BadRequest(new ApiResponse<object> { Success = false, Message = "ID Mismatch" });
            }

            var validationResult = await _validator.ValidateAsync(grievance);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ApiResponse<object> { Success = false, Message = "Validation Failed", Data = null, Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList() });
            }

            var existingGrievance = await _context.Grievances.FindAsync(id);
            if (existingGrievance == null)
            {
                return NotFound(new ApiResponse<object> { Success = false, Message = "Grievance Not Found" });
            }

            existingGrievance.RaisedBy = grievance.RaisedBy;
            existingGrievance.CategoryId = grievance.CategoryId;
            existingGrievance.Title = grievance.Title;
            existingGrievance.Description = grievance.Description;
            existingGrievance.StatusId = grievance.StatusId;
            existingGrievance.PriorityId = grievance.PriorityId;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        
        
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var grievance = await _context.Grievances.FindAsync(id);
            if (grievance == null)
            {
                return NotFound();
            }

            _context.Grievances.Remove(grievance);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        
    }
}
