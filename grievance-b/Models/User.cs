using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace grievance_b.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        [ForeignKey("Roles")]
        public int RoleId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public string ProfilePicturePath { get; set; } = string.Empty;
        //[ForeignKey("RoleId")]
        public Roles Roles { get; set; }
        public ICollection<Grievances> Grievances { get; set; } = new List<Grievances>();
        public ICollection<GrievanceAssignments> Assignments { get; set; } = new List<GrievanceAssignments>();
        public ICollection<GrievanceStatusHistory> StatusUpdates { get; set; } = new List<GrievanceStatusHistory>();
    }
}