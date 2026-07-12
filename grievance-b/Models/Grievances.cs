using System.ComponentModel.DataAnnotations;

namespace grievance_b.Models
{
    public class Grievances

    {
        [Key]
        public int GrievanceId { get; set; }
        public int RaisedBy { get; set; }
        public int CategoryId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Status { get; set; }
        public int Priority { get; set; }
    }
}