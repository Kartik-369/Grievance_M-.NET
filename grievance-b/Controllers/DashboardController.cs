using grievance_b.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace grievance_b.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("TotalUsers")]
        public async Task<IActionResult> GetTotalUsers()
        {
            var result = await _context.Users.CountAsync();
            return Ok(result);
        }
        [HttpGet("TotalRoles")]
        public async Task<IActionResult> GetTotalRoles()
        {
            var result = await _context.Roles.CountAsync();
            return Ok(result);
        }
            
        [HttpGet("TotalGrievancesAvailable")]
        public async Task<IActionResult> GetTotalGrievancesAvailable()
        {
            var result = await _context.Grievances.CountAsync();
            return Ok(result);
        } 
        [HttpGet("TotalGrievanceStatus")]
        public async Task<IActionResult> GetGrievanceStatusCategories()
        {
            var result = await _context.Grievances.GroupBy(g => g.status.StatusName)
                .Select(g => new
                {
                    Status = g.Key,
                    TotalGrievances = g.Count()
                }).ToListAsync();
            return Ok(result);
        } 
        [HttpGet("PriorityWiseGrievanceCount")]
        public async Task<IActionResult> GetPriorityWiseGrievanceCount()
        {
            var result = await _context.Grievances.GroupBy(g => g.priority.PriorityName)
                .Select(g => new
                {
                    Priority = g.Key,
                    TotalGrievances = g.Count()
                }).ToListAsync();
            return Ok(result);
        }  
        [HttpGet("TotalGrievancesAssigned")]
        public async Task<IActionResult> GetTotalGrievancesAssigned()
        {
            var result = await _context.GrievanceAssignments.GroupBy(ga => ga.User.FirstName + " " + ga.User.LastName)
                .Select(g => new
                {
                    AssignedUser = g.Key,
                    Grievances = g.Count()
                }).ToListAsync();

            return Ok(result);
        } 
        [HttpGet("TotalGrievancesRaisedByUser")]
        public async Task<IActionResult> GetTotalGrievancesRaisedByUser()
        {
            var result = await _context.Grievances.GroupBy(g => g.User.FirstName + " " + g.User.LastName)
                .Select(g => new
                {
                    RaisedBy = g.Key,
                    Grievances = g.Count()
                }).ToListAsync();
            return Ok(result);
        } 
        [HttpGet("Top10Complainants")]
        public async Task<IActionResult> GetTop10Complainants()
        {
            var result = await _context.Grievances.GroupBy(g => g.User.FirstName + " " + g.User.LastName)
                .Select(g => new
                {
                    User = g.Key,
                    TotalRaised = g.Count()
                })
                .OrderByDescending(user => user.TotalRaised)
                .Take(10)
                .ToListAsync();
            return Ok(result);
        }
        [HttpGet("LowestComplainants")]
        public async Task<IActionResult> GetLowestComplainants()
        {
            var result = await _context.Grievances.GroupBy(g => g.User.FirstName + " " + g.User.LastName)
                .Select(g => new
                {
                    User = g.Key,
                    TotalRaised = g.Count()
                })
                .OrderBy(user => user.TotalRaised)
                .Take(10)
                .ToListAsync();
            return Ok(result);
        } 
        [HttpGet("UnassignedGrievances")]
        public async Task<IActionResult> GetUnassignedGrievances()
        {
            var result = await _context.Grievances.Where(g => !g.Assignments.Any())
                .Select(g => new
                {
                    g.Title,
                    RaisedBy = g.User.FirstName + " " + g.User.LastName,
                    Category = g.GrievanceCategories.CategoryName,
                    Priority = g.priority.PriorityName
                })
                .ToListAsync();
            return Ok(result);
        }   
        [HttpGet("RecentStatusUpdates")]
        public async Task<IActionResult> GetRecentStatusUpdates()
        {
            var result = await _context.GrievanceStatusHistory
                .Where(h => h.UpdatedOn >= DateTime.Today.AddDays(-7) && h.UpdatedOn <= DateTime.Today)
                .Select(h => new
                {
                    h.Grievances.Title,
                    UpdatedBy = h.User.FirstName + " " + h.User.LastName,
                    h.UpdatedOn
                })
                .ToListAsync();
            return Ok(result);
        }
        [HttpGet("TotalUsersByRole")]
        public async Task<IActionResult> GetTotalUsersByRole()
        {
            var result = await _context.Users.GroupBy(u => u.Roles.RoleName)
                .Select(g => new
                {
                    Role = g.Key,
                    Users = g.Count()
                }).ToListAsync();
            return Ok(result);
        } 
        [HttpGet("TotalMonthWiseUpdates")]
        public async Task<IActionResult> GetTotalMonthWiseUpdates()
        {
            var result = await _context.GrievanceStatusHistory.GroupBy(h => new
            {
                Year = h.UpdatedOn.Year,
                Month = h.UpdatedOn.Month
            })
            .Select(g => new {
                Year = g.Key.Year,
                Month = g.Key.Month,
                TotalUpdates = g.Count()
            })
            .OrderBy(g => g.Year)
            .ThenBy(g => g.Month)
            .ToListAsync();
            return Ok(result);
        }
        [HttpGet("TotalRoleWiseActiveUser")]
        public async Task<IActionResult> GetTotalRoleWiseActiveUser()
        {
            var result = await _context.Users.Where(u => u.IsActive)
                .GroupBy(u => u.Roles.RoleName)
                .Select(g => new
                {
                    Role = g.Key,
                    ActiveUser = g.Count()
                })
                .OrderByDescending(g => g.ActiveUser)
                .ToListAsync();
            return Ok(result);
        } 
        [HttpGet("RoleByUsers")]
        public async Task<IActionResult> GetRoleByUsers()
        {
            var result = await _context.Users.GroupBy(u => u.Roles.RoleName)
                .Select(g => new
                {
                    RoleName = g.Key,
                    UserName = g.Select(u => u.FirstName + " " + u.LastName).ToList()
                })
                .ToListAsync();
            return Ok(result);
        } 
        [HttpGet("RoleWithUsers")]
        public async Task<IActionResult> GetRoleWithUsers()
        {
            var result = await _context.Users.GroupBy(u => u.Roles.RoleName)
                .Select(g => new
                {
                    RoleName = g.Key,
                    TotalUsers = g.Count()
                })
                .Where(g => g.TotalUsers > 10)
                .ToListAsync();
            return Ok(result);
        }  
        [HttpGet("RoleStatistics")]
        public async Task<IActionResult> GetRoleStatistics()
        {
            var result = await _context.Users.GroupBy(u => u.Roles.RoleName)
                .Select(g => new
                {
                    RoleName = g.Key,
                    TotalUsers = g.Count(),
                    ActiveUsers = g.Count(u => u.IsActive),
                    InactiveUsers = g.Count(u => !u.IsActive)
                })
                .OrderByDescending(g => g.TotalUsers)
                .ToListAsync();
            return Ok(result);
        }
        

        
        [HttpGet("RecentAssignments")]
        public async Task<IActionResult> GetRecentAssignments()
        {
            var result = await _context.GrievanceAssignments
                .OrderByDescending(ga => ga.AssignedAt)
                .Take(10)
                .Select(ga => new
                {
                    ga.Grievances.Title,
                    AssignedTo = ga.User.FirstName + " " + ga.User.LastName,
                    ga.AssignedAt
                })
                .ToListAsync();
            return Ok(result);
        }
        

        
        [HttpGet("CategorySummary")]
        public async Task<IActionResult> GetCategorySummary()
        {
            var result = await _context.Grievances.GroupBy(g => g.GrievanceCategories.CategoryName)
                .Select(g => new
                {
                    Category = g.Key,
                    TotalGrievances = g.Count(),
                    Resolved = g.Count(t => t.status.StatusName == "Resolved"),
                    Pending = g.Count(t => t.status.StatusName != "Resolved")
                })
                .ToListAsync();
            return Ok(result);
        }
        

        
        [HttpGet("CategoryPriorityStats")]
        public async Task<IActionResult> GetCategoryPriorityStats()
        {
            var result = await _context.Grievances.GroupBy(g => new { g.GrievanceCategories.CategoryName, g.priority.PriorityName })
                .Select(g => new
                {
                    Category = g.Key.CategoryName,
                    Priority = g.Key.PriorityName,
                    Count = g.Count()
                })
                .ToListAsync();
            return Ok(result);
        }
        

        
        [HttpGet("TopCategories")]
        public async Task<IActionResult> GetTopCategories()
        {
            var result = await _context.Grievances.GroupBy(g => g.GrievanceCategories.CategoryName)
                .Select(g => new
                {
                    Category = g.Key,
                    TotalGrievances = g.Count(),
                })
                .OrderByDescending(g => g.TotalGrievances)
                .Take(5)
                .ToListAsync();
            return Ok(result);
        }
        

        
        [HttpGet("UserAssignmentSummary")]
        public async Task<IActionResult> GetUserAssignmentSummary()
        {
            var result = await _context.GrievanceAssignments.GroupBy(ga => ga.User.FirstName + " " + ga.User.LastName)
                .Select(g => new
                {
                    AssignedUser = g.Key,
                    TotalAssignments = g.Count()
                })
                .ToListAsync();
            return Ok(result);
        }
        

        
        [HttpGet("UserGrievanceStatistics")]
        public async Task<IActionResult> GetUserGrievanceStatistics()
        {
            var result = await _context.Grievances.GroupBy(g => g.User.FirstName + " " + g.User.LastName)
                .Select(g => new
                {
                    User = g.Key,
                    TotalRaised = g.Count(),
                    Resolved = g.Count(t => t.status.StatusName == "Resolved"),
                    Pending = g.Count(t => t.status.StatusName != "Resolved")
                })
                .ToListAsync();
            return Ok(result);
        }
        

        
        [HttpGet("CriticalCategories")]
        public async Task<IActionResult> GetCriticalCategories()
        {
            var result = await _context.Grievances
                .Where(g => g.priority.PriorityName == "Critical")
                .Select(g => new
                {
                    Category = g.GrievanceCategories.CategoryName,
                    Title = g.Title,
                    RaisedBy = g.User.FirstName + " " + g.User.LastName
                }).ToListAsync();
            return Ok(result);
        }
        

        
        [HttpGet("MonthWiseAssignments")]
        public async Task<IActionResult> GetMonthWiseAssignments()
        {
            var result = await _context.GrievanceAssignments.GroupBy(ga => new
            {
                Year = ga.AssignedAt.Year,
                Month = ga.AssignedAt.Month
            })
            .Select(g => new
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                TotalAssignments = g.Count(),
            })
            .OrderBy(g => g.Year)
            .ThenBy(g => g.Month)
            .ToListAsync();
            return Ok(result);
        }
        

        
        [HttpGet("RankStaffByUpdates")]
        public async Task<IActionResult> GetRankStaffByUpdates()
        {
            var result = await _context.GrievanceStatusHistory.GroupBy(h => h.User.FirstName + " " + h.User.LastName)
                .Select(g => new
                {
                    StaffMember = g.Key,
                    UpdatesMade = g.Count()
                })
                .OrderByDescending(g => g.UpdatesMade)
                .ToListAsync();
            return Ok(result);
        }
        

        
        [HttpGet("CategoryStatistics")]
        public async Task<IActionResult> GetCategoryStatistics()
        {
            var result = await _context.Grievances.GroupBy(g => g.GrievanceCategories.CategoryName)
                .Select(g => new
                {
                    Category = g.Key,
                    TotalGrievances = g.Count(),
                    Resolved = g.Count(t => t.status.StatusName == "Resolved"),
                    Pending = g.Count(t => t.status.StatusName != "Resolved"),
                    Critical = g.Count(t => t.priority.PriorityName == "Critical")
                })
                .ToListAsync();
            return Ok(result);
        }
        
    }
}
