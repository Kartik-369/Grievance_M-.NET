using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace grievance_b.Models
{
    public class Grievances

    {
        [Key]
        public int GrievanceId { get; set; }
        [ForeignKey("User")]
        public int RaisedBy { get; set; }
        [ForeignKey("GrievanceCategories")]
        public int CategoryId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        [ForeignKey("status")]
        public int StatusId { get; set; }
        [ForeignKey("priority")]
        public int PriorityId { get; set; }
        public User User { get; set; }
        public GrievanceCategories GrievanceCategories { get; set; }
        public Status status { get; set; }
        public Priority priority { get; set; }
        public ICollection<GrievanceAssignments> Assignments { get; set; } = new List<GrievanceAssignments>();
        public ICollection<GrievanceStatusHistory> StatusHistories { get; set; } = new List<GrievanceStatusHistory>();
    }
}