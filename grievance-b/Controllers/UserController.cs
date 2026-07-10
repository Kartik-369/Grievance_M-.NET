using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using grievance_b.Data;
using grievance_b.Models;

namespace grievance_b.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        #region Dependency Injected
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }
        #endregion

        #region Get All Users
        // GET: api/user
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            // Retrieves all records from the Users table
            var users = await _context.Users.ToListAsync();

            return Ok(users);
        }
        #endregion

        #region Get User By ID
        // GET: api/user/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            // Finds a specific user by their Primary Key (UserId)
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
        #endregion
    }
}