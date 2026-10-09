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
    [Authorize(Roles = "Admin")]
    public class GrievanceCategoryController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IValidator<GrievanceCategoryDTO> _validator;

        public GrievanceCategoryController(AppDbContext context, IValidator<GrievanceCategoryDTO> validator)
        {
            _context = context;
            _validator = validator;
        }
        

        
        // GET: api/grievancecategory
        [HttpGet]
        public async Task<IActionResult> GetAllGrievanceCategories()
        {
            var categories = await _context.GrievanceCategories
                .Select(x => new GrievanceCategoryDTO
                {
                    CategoryId = x.CategoryId,
                    CategoryName = x.CategoryName,
                    CssClassName = x.CssClassName
                })
                .ToListAsync();

            return Ok(new ApiResponse<List<GrievanceCategoryDTO>>
            {
                Success = true,
                Message = "Categories Retrieved Successfully",
                Data = categories
            });
        }
        

        
        // GET: api/grievancecategory/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetGrievanceCategoryById(int id)
        {
            var category = await _context.GrievanceCategories.FindAsync(id);

            if (category == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Category Not Found",
                    Errors = new List<string> { "No Record of such Category" }
                });
            }

            var categoryDto = new GrievanceCategoryDTO
            {
                CategoryId = category.CategoryId,
                CategoryName = category.CategoryName,
                CssClassName = category.CssClassName
            };

            return Ok(new ApiResponse<GrievanceCategoryDTO>
            {
                Success = true,
                Message = "Category Found",
                Data = categoryDto
            });
        }
        

        
        [HttpPost]
        public async Task<IActionResult> Create(GrievanceCategoryDTO category)
        {
            var validationResult = await _validator.ValidateAsync(category);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ApiResponse<object> { Success = false, Message = "Validation Failed", Data = null, Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList() });
            }

            var ent = new GrievanceCategories()
            {
                CategoryName = category.CategoryName,
                CssClassName = category.CssClassName
            };

            _context.GrievanceCategories.Add(ent);
            await _context.SaveChangesAsync();

            category.CategoryId = ent.CategoryId;

            return Ok(new ApiResponse<GrievanceCategoryDTO>
            {
                Success = true,
                Message = "Category Added Successfully",
                Data = category
            });
        }
        

        
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, GrievanceCategoryDTO category)
        {
            if (id != category.CategoryId)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "ID Mismatch",
                    Errors = new List<string> { "The ID in the URL does not match the body." }
                });
            }

            var validationResult = await _validator.ValidateAsync(category);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ApiResponse<object> { Success = false, Message = "Validation Failed", Data = null, Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList() });
            }

            var existingCategory = await _context.GrievanceCategories.FindAsync(id);
            if (existingCategory == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Category Not Found",
                    Errors = new List<string> { "No Record of such Category" }
                });
            }

            existingCategory.CategoryName = category.CategoryName;
            existingCategory.CssClassName = category.CssClassName;

            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Category Updated Successfully"
            });
        }
        

        
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.GrievanceCategories.FindAsync(id);
            if (category == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Category Not Found",
                    Errors = new List<string> { "No Record of such Category" }
                });
            }

            _context.GrievanceCategories.Remove(category);
            await _context.SaveChangesAsync();



            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Category Deleted Successfully"
            });
        }
        
    }
}
