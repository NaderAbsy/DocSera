using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Docsera.Models;

namespace Docsera.Models.EntityTypeConfig
{
    public class ContactFormEntityTypeConfig : IEntityTypeConfiguration<ContactForm>
    {
        public void Configure(EntityTypeBuilder<ContactForm> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).UseMySqlIdentityColumn();

            builder.Property(x => x.Name).IsRequired().HasMaxLength(50);

            builder.Property(x => x.Email).IsRequired().HasMaxLength(100);

            builder.Property(x => x.Massage).IsRequired();

        }
    }
}

