using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Docsera.Models.EntityTypeConfig
{

        public class AppointmentHistoryEntityTypeConfig : IEntityTypeConfiguration<AppointmentHistory>
        {
            public void Configure(EntityTypeBuilder<AppointmentHistory> builder)
            {
                builder.HasKey(x => x.Id);
                builder.Property(x => x.Id).UseMySqlIdentityColumn();

                builder.Property(x => x.DocId).IsRequired();

                builder.Property(x => x.DocName).IsRequired().HasMaxLength(100);

                builder.Property(x => x.PatientId).IsRequired();


                builder.Property(x => x.PatientName).IsRequired().HasMaxLength(100);


                builder.Property(x => x.Date).IsRequired();


                builder.Property(x => x.AppointmentDetail).IsRequired();

                builder.Property(x => x.DocNotes).IsRequired();

                builder.Property(x => x.PatientNotes).IsRequired();



        }
        }
    
}

