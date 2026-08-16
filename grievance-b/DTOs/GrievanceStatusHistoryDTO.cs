namespace grievance_b.DTOs
{
    public class GrievanceStatusHistoryDTO
    {
        public int StatusHistoryId { get; set; }
        public int GrievanceId { get; set; }
        public int Status { get; set; }

        public string? StatusName { get; set; }

        public string? Remarks { get; set; }

        public int UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
    }
}
