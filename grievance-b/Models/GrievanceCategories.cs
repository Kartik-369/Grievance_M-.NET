using System.ComponentModel.DataAnnotations;

namespace grievance_b.Models
{
    public class GrievanceCategories
    {
        [Key]
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string CssClassName { get; set; } = string.Empty;
    }
}