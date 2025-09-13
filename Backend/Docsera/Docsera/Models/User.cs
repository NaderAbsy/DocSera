namespace Docsera.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public string Password { get; set; }

        public string UserType { get; set; }

        public bool EmailConfirmed { get; set; } = false;

        public string EmailConfirmationToken { get; set; }

        public byte[] ProfilePicture { get; set; }

        public bool IsLogedIn { get; set; }


         
    }
}
