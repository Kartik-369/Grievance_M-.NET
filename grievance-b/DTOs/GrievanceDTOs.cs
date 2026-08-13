namespace grievance_b.DTOs
{
    public class GrievanceDTO
    {
        public int GrievanceId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int RaisedBy { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int StatusId { get; set; }
        public int PriorityId { get; set; }
    }

    public class GrievanceAssignmentDTO
    {
        public int AssignmentId { get; set; }
        public int GrievanceId { get; set; }
        public int AssignedTo { get; set; }
        public DateTime AssignedAt { get; set; }
        // Flattened property
        public string GrievanceTitle { get; set; }
    }

    public class GrievanceStatusHistoryDTO
    {
        public int StatusHistoryId { get; set; }
        public int GrievanceId { get; set; }
        public int Status { get; set; }
        // Flattened property
        public string StatusName { get; set; }
        public string Remarks { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
    }
}
