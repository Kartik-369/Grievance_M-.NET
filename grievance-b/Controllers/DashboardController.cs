using grievance_b.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace grievance_b.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        #region 1) Display the total number of users registered in the system (Translates from Total Students)
        [HttpGet("TotalUsers")]
        public async Task<IActionResult> GetTotalUsers()
        {
            var result = await _context.Users.CountAsync();
            return Ok(result);
        }
        #endregion

        #region 2) Display the total number of roles in the system (Translates from Total Faculty)
        [HttpGet("TotalRoles")]
        public async Task<IActionResult> GetTotalRoles()
        {
            var result = await _context.Roles.CountAsync();
            return Ok(result);
        }
        #endregion

        #region 3) Display the total number of grievances available in the system (Translates from Total Projects)
        [HttpGet("TotalGrievancesAvailable")]
        public async Task<IActionResult> GetTotalGrievancesAvailable()
        {
            var result = await _context.Grievances.CountAsync();
            return Ok(result);
        }
        #endregion

        #region 4) Show how many grievances belong to each status category (Translates from Task Status)
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
        #endregion

        #region 5) Show priority wise grievance count (Translates from Priority Task Count)
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
        #endregion

        #region 6) Show how many grievances are assigned to each user (Translates from Projects per Faculty)
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
        #endregion

        #region 7) Show how many grievances have been raised by each user (Translates from Tasks per Student)
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
        #endregion

        #region 8) Display the top 10 users who raised the most grievances (Translates from Highest Average Score)
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
        #endregion

        #region 9) Display bottom 10 users based on grievances raised (Translates from Lowest Average Score)
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
        #endregion

        #region 10) Display unassigned grievances (Translates from Overdue Tasks)
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
        #endregion

        #region 11) Display recent status updates in the last 7 days (Translates from Follow-up Tasks)
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
        #endregion

        #region 12) Show how many users belong to each role (Translates from Students by Grade)
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
        #endregion

        #region 13) Show month-wise status update count (Translates from Month-wise Completed Tasks)
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
        #endregion

        #region 14) Display Role Wise Active User Count.
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
        #endregion

        #region 15) Display each role with users assigned to it.
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
        #endregion

        #region 16) List Roles Having More Than 10 Users.
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
        #endregion

        #region 17) Display role statistics.
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
        #endregion

        #region 18) Show latest 10 grievance assignments (Translates from Tasks Due Soon)
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
        #endregion

        #region 19) Display each category with total grievances, resolved, and pending (Translates from Tasks Summary)
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
        #endregion

        #region 20) Display Priority breakdown for each category (Translates from Project-wise Score)
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
        #endregion

        #region 21) Display Top 5 categories with the most grievances (Translates from Top 10 Projects)
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
        #endregion

        #region 22) Show assignment counts per user (Translates from Faculty Project Summary)
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
        #endregion

        #region 23) Display grievance raised statistics per user (Translates from Task Completion Statistics)
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
        #endregion

        #region 24) Display Categories with critical priority grievances (Translates from Overdue Projects)
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
        #endregion

        #region 25) Show month-wise newly assigned grievances (Translates from Month-wise Completed Tasks - Kept Active)
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
        #endregion

        #region 26) Rank users based on number of status updates applied (Translates from Rank Faculties)
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
        #endregion

        #region 27) Display full statistics for every category (Translates from Task Statistics for Every Project)
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
        #endregion
    }
}
