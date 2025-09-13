using Microsoft.EntityFrameworkCore;
using Docsera.Models;
using Docsera.Models.EntityTypeConfig;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;


namespace Docsera.Context
{
    public class DocseraDBContect : DbContext
    {
        public DocseraDBContect(DbContextOptions<DocseraDBContect> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration<User>(new UserEntityTypeConfig());
            modelBuilder.ApplyConfiguration<DoctorReq>(new DoctorReqEntityTypeConfig());
            modelBuilder.ApplyConfiguration<ContactForm>(new ContactFormEntityTypeConfig()); 
            modelBuilder.ApplyConfiguration<AppointmentHistory>(new AppointmentHistoryEntityTypeConfig());
            modelBuilder.ApplyConfiguration<ChatHistory>(new ChatHistoryEntityTypeConfig());
            modelBuilder.ApplyConfiguration<DoctorTicket>(new DoctorTicketEntityTypeConfic());
            modelBuilder.ApplyConfiguration<CommunityQuestion>(new CommunityQuestionEntityTyprConfig());
            modelBuilder.ApplyConfiguration<Rate>(new RateEntityTypeConfig());


        }

        public DbSet<User> User { get; set; }
        public DbSet<DoctorReq> DoctorReq { get ; set; }

        public DbSet<ContactForm> ContactForm { get; set; }

        public DbSet<AppointmentHistory> AppointmentHistory { get; set; }
        public DbSet<ChatHistory> ChatHistory { get; set; }

        public DbSet<DoctorTicket> DoctorTicket { get; set; }

        public DbSet<CommunityQuestion> CommunityQuestion { get; set; }
        public DbSet<Rate> Rate { get; set; }




    }

}

