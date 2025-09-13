namespace Docsera.Models
{
    public class DoctorReq
    {
        public int Id { get; set; }
        public string DocName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public string Decs { get; set; } 

        public string state { get; set; } 

        public string AdminMassage {  get; set; }

        public string Password { get; set; }


    }
}
