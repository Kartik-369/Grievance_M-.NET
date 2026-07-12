using System;
using System.ComponentModel.DataAnnotations;

namespace grievance_b.Models
{
    public class GrievanceStatusHistory

    {
        [Key]
        public int StatusHistoryId { get; set; }
        public int GrievanceId { get; set; }
        public int Status { get; set; }
        public string? Remarks { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; } = DateTime.Now;
    }
}