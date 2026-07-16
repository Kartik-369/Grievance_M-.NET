using System;
using System.ComponentModel.DataAnnotations;

namespace grievance_b.Models
{
    public class GrievanceAssignments

    {
        [Key]
        public int AssignmentId { get; set; }
        public int GrievanceId { get; set; }
        public int AssignedTo { get; set; }
        public DateTime AssignedAt { get; set; } = DateTime.Now;
    }
}