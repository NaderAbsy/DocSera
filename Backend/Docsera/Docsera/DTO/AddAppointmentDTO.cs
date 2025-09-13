namespace Docsera.DTO
{
    public class AddAppointmentDTO
    {
        public int DocId { get; set; }
        public int PatientId { get; set; }
        public DateTime Date { get; set; }
        public string AppointmentDetail { get; set; }
        public string PatientNotes { get; set; }


    }
}
