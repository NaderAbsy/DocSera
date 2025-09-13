using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Docsera.Models.EntityTypeConfig
{
    public class ChatHistoryEntityTypeConfig : IEntityTypeConfiguration<ChatHistory>
    {
        public void Configure(EntityTypeBuilder<ChatHistory> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).UseMySqlIdentityColumn();

            builder.Property(x => x.PatientId).IsRequired();

            builder.Property(x => x.CreatedAt).IsRequired().HasMaxLength(100);

            builder.Property(x => x.Message).IsRequired();



        }
    }


}





