using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using grievance_b.Data;
using grievance_b.Models;

namespace grievance_b.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GrievanceCategoryController : ControllerBase
    {
        #region Dependency Injected
        private readonly AppDbContext _context;

        public GrievanceCategoryController(AppDbContext context)
        {
            _context = context;
        }
        #endregion

        #region Get All Grievance Categories
        // GET: api/grievancecategory
        [HttpGet]
        public async Task<IActionResult> GetAllGrievanceCategories()
        {
            var categories = await _context.GrievanceCategories.ToListAsync();
            return Ok(categories);
        }
        #endregion

        #region Get Grievance Category By ID
        // GET: api/grievancecategory/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGrievanceCategoryById(int id)
        {
            var category = await _context.GrievanceCategories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }
        #endregion

        #region Create Grievance Category
        [HttpPost]
        public async Task<IActionResult> Create(GrievanceCategories category)
        {
            await _context.GrievanceCategories.AddAsync(category);
            await _context.SaveChangesAsync();
            return Ok();
        }
        #endregion

        #region Update Grievance Category
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, GrievanceCategories category)
        {
            if (id != category.CategoryId)
            {
                return BadRequest();
            }
            
            var existingCategory = await _context.GrievanceCategories.FindAsync(id);
            if (existingCategory == null)
            {
                return NotFound();
            }

            existingCategory.CategoryName = category.CategoryName;
            existingCategory.CssClassName = category.CssClassName;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        #endregion
        #region Delete Grievance Category
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.GrievanceCategories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            _context.GrievanceCategories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        #endregion
    }
}