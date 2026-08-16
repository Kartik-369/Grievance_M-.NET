namespace grievance_b.DTOs
{
    public class GrievanceAssignmentDTO
    {
        public int AssignmentId { get; set; }
        public int GrievanceId { get; set; }
        public int AssignedTo { get; set; }
        public DateTime AssignedAt { get; set; }

        public string? GrievanceTitle { get; set; }
    }
}
