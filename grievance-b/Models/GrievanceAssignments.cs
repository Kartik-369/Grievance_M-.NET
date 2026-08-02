using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace grievance_b.Models
{
    public class GrievanceAssignments

    {
        [Key]
        public int AssignmentId { get; set; }
        [ForeignKey("Grievances")]
        public int GrievanceId { get; set; }
        [ForeignKey("User")]
        public int AssignedTo { get; set; }
        public DateTime AssignedAt { get; set; } = DateTime.Now;
        public Grievances Grievances { get; set; }
        public User User { get; set; }
    }
}