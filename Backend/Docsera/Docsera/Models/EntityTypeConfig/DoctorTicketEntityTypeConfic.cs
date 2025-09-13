using Docsera.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Docsera.Models.EntityTypeConfig
{
    public class DoctorTicketEntityTypeConfic : IEntityTypeConfiguration<DoctorTicket>
    {
        public void Configure(EntityTypeBuilder<DoctorTicket> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).UseMySqlIdentityColumn();

            builder.Property(x => x.DocId).IsRequired();

            builder.Property(x => x.DocName);


            builder.Property(x => x.Title).IsRequired().HasMaxLength(100);

            builder.Property(x => x.Desc).IsRequired();

        }
    }
}




