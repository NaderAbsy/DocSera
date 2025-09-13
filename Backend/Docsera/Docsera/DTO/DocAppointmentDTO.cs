namespace Docsera.DTO
{
    public class DocAppointmentDTO
    {
        public int Id { get; set; }
        public int DocId { get; set; }
        public int PatientId { get; set; }

        public DateTime Date { get; set; }

        public string AppointmentDetail { get; set; }
        public string DocNotes { get; set; }
    }
}
