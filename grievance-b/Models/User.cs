using System.ComponentModel.DataAnnotations;

namespace grievance_b.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public string ProfilePicturePath { get; set; } = string.Empty;
    }
}