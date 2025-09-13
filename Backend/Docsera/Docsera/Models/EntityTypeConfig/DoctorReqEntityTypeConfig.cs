
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Docsera.Models;


namespace Docsera.Models.EntityTypeConfig
{
    public class DoctorReqEntityTypeConfig : IEntityTypeConfiguration<DoctorReq>
    {
        public void Configure(EntityTypeBuilder<DoctorReq> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).UseMySqlIdentityColumn();

            builder.Property(x => x.DocName).IsRequired().HasMaxLength(50);

            builder.Property(x => x.PhoneNumber).IsRequired().HasMaxLength(10);

            builder.Property(x => x.Email).IsRequired().HasMaxLength(100);

            builder.Property(x => x.Decs).IsRequired();
            builder.Property(x => x.Password).IsRequired();

            builder.Property(x => x.state).IsRequired().HasDefaultValue("Pending");

            builder.Property(x => x.AdminMassage);





        }
    }
}

