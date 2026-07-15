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

        #region Get All Categories
        // GET: api/grievancecategory
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _context.GrievanceCategories.ToListAsync();
            return Ok(categories);
        }
        #endregion

        #region Get Category By ID
        // GET: api/grievancecategory/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _context.GrievanceCategories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }
        #endregion
    }
}