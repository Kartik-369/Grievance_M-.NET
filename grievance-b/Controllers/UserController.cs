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
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }
        #endregion

        #region Get User By ID
        // GET: api/user/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
        #endregion

        #region Create User
        [HttpPost]
        public async Task<IActionResult> Create(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return Ok();
        }
        #endregion

        #region Update User
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, User user)
        {
            if (id != user.UserId)
            {
                return NoContent();
            }
            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }
            existingUser.RoleId = user.RoleId;
            existingUser.FirstName = user.FirstName;
            existingUser.LastName = user.LastName;
            existingUser.Email = user.Email;
            existingUser.Password = user.Password;
            existingUser.IsActive = user.IsActive;
            existingUser.ProfilePicturePath = user.ProfilePicturePath;
            await _context.SaveChangesAsync();
            return NoContent();
        }
        #endregion
        #region Delete User
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        #endregion
    }
}