using System.ComponentModel.DataAnnotations.Schema;

namespace Docsera.Models
{
    public class CommunityQuestion
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string category { get; set; }

        public DateTime DateTime { get; set; } = DateTime.Now;

        public List<string> Replies { get; set; } = new List<string>();


    }
}
