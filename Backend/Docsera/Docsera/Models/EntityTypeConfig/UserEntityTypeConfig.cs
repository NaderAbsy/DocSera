using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Docsera.Models;


namespace Docsera.Models.EntityTypeConfig
{
    public class UserEntityTypeConfig : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).UseMySqlIdentityColumn();

            builder.Property(x => x.FirstName).IsRequired().HasMaxLength(50);

            builder.Property(x => x.LastName).IsRequired().HasMaxLength(50);

            builder.Property(x => x.PhoneNumber).IsRequired().HasMaxLength(10);

            builder.Property(x => x.Email).IsRequired().HasMaxLength(100);

            builder.Property(x => x.UserType).IsRequired(); 

            builder.Property(x=>x.Password).IsRequired();

            builder.Property(x=>x.ProfilePicture).IsRequired(false);

            builder.Property(x => x.EmailConfirmed).IsRequired().HasDefaultValue(false);



        }
    }
}

