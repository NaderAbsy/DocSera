namespace Docsera.DTO
{
    public class CommunityQuestionDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string category { get; set; }

        public DateTime DateTime { get; set; } = DateTime.Now;

        public List<string> Replies { get; set; } = new List<string>();
    }
}
