namespace Docsera.Models
{
    public class ChatHistory
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
