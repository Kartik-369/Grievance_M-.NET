using System.ComponentModel.DataAnnotations;

namespace grievance_b.Models
{
    public class Priority
    {
        [Key]
        public int PriorityId { get; set; }
        public string PriorityName { get; set; } = string.Empty;
        public string PriorityCssClass { get; set; } = string.Empty;
        public ICollection<Grievances> Grievances { get; set; } = new List<Grievances>();
    }
}