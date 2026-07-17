using grievance_b.Models;
using Microsoft.EntityFrameworkCore;

namespace grievance_b.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Roles> Roles => Set<Roles>();
        public DbSet<User> Users => Set<User>();
        public DbSet<GrievanceCategories> GrievanceCategories => Set<GrievanceCategories>();
        public DbSet<Status> Status => Set<Status>();
        public DbSet<Priority> Priority => Set<Priority>();
        public DbSet<Grievances> Grievances => Set<Grievances>();
        public DbSet<GrievanceAssignments> GrievanceAssignments => Set<GrievanceAssignments>();
        public DbSet<GrievanceStatusHistory> GrievanceStatusHistory => Set<GrievanceStatusHistory>();
    }
}