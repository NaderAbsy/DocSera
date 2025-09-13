namespace Docsera.DTO
{
    public class AppointmentHistoryDTO
    {
        public int DocId { get; set; }
        public string DocName { get; set; }
        public string PatientName { get; set; }
        public DateTime Date { get; set; }
        public string AppointmentDetail { get; set; }
        public string DocNotes { get; set; }
        public string PatientNotes { get; set; }
    }
}
