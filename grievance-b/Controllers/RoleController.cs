using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using grievance_b.Data;
using grievance_b.Models;

namespace grievance_b.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        #region Dependency Injected
        private readonly AppDbContext _context;

        public RoleController(AppDbContext context)
        {
            _context = context;
        }
        #endregion

        #region Get All Roles
        // GET: api/role
        [HttpGet]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _context.Roles.ToListAsync();
            return Ok(roles);
        }
        #endregion

        #region Get Role By ID
        // GET: api/role/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoleById(int id)
        {
            var role = await _context.Roles.FindAsync(id);

            if (role == null)
            {
                return NotFound();
            }

            return Ok(role);
        }
        #endregion
    }
}