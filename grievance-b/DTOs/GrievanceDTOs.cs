namespace grievance_b.DTOs
{
    public class GrievanceDTO
    {
        public int GrievanceId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int RaisedBy { get; set; }
        public int CategoryId { get; set; }

        public string? CategoryName { get; set; }

        public int StatusId { get; set; }
        public int PriorityId { get; set; }
    }
}