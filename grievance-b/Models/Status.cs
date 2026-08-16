namespace grievance_b.Models
{
    public class Status
    {
        public int StatusID { get; set; }
        public string StatusName { get; set; } = string.Empty;
        public string StatusCssClass { get; set; } = string.Empty;
        public ICollection<Grievances> Grievances { get; set; } = new List<Grievances>();
        public ICollection<GrievanceStatusHistory> StatusHistories { get; set; } = new List<GrievanceStatusHistory>();
    }
}