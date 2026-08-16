using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace grievance_b.Models
{
    public class GrievanceStatusHistory

    {
        [Key]
        public int StatusHistoryId { get; set; }
        [ForeignKey("Grievances")]
        public int GrievanceId { get; set; }
        [ForeignKey("StatusNavigation")]
        public int Status { get; set; }
        public string? Remarks { get; set; }
        [ForeignKey("User")]
        public int UpdatedBy { get; set; }
        public User User { get; set; }
        public DateTime UpdatedOn { get; set; } = DateTime.Now;
        public Grievances Grievances { get; set; }
        public Status StatusNavigation { get; set; }
    }
}