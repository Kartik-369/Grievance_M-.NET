using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using grievance_b.Data;
using grievance_b.Models;
using grievance_b.DTOs;
using grievance_b.Common;

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
            var grievances = await _context.Grievances
                .Include(x => x.GrievanceCategories)
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

            return Ok(new ApiResponse<List<GrievanceDTO>>{
                Success=true,
                Message="Grievances Retrieved Successfully",
                Data=grievances
            });
        }
        #endregion

        #region Get Grievance By ID
        // GET: api/grievance/5
        [HttpGet("{id}")]
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
        #endregion

        #region Create Grievance
        [HttpPost]
        public async Task<IActionResult> Create(GrievanceDTO grievance)
        {
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
        #endregion

        #region Update Grievance
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Grievances grievance)
        {
            if (id != grievance.GrievanceId)
            {
                return BadRequest();
            }

            var existingGrievance = await _context.Grievances.FindAsync(id);
            if (existingGrievance == null)
            {
                return NotFound();
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
        #endregion
        #region Delete Grievance
        [HttpDelete("{id}")]
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
        #endregion
    }
}
