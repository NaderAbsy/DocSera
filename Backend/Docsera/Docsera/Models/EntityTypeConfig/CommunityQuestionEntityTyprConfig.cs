using Docsera.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Text.Json;
using System.Collections.Generic;
namespace Docsera.Models.EntityTypeConfig
{
    public class CommunityQuestionEntityTyprConfig : IEntityTypeConfiguration<CommunityQuestion>
    {
        public void Configure(EntityTypeBuilder<CommunityQuestion> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).UseMySqlIdentityColumn();

            builder.Property(x => x.Title).IsRequired();

            builder.Property(x => x.Description).IsRequired();

            builder.Property(x=>x.category).IsRequired();

            builder.Property(x => x.DateTime).IsRequired().HasDefaultValue(DateTime.Now);

            var converter = new ValueConverter<List<string>, string>(
                           v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                           v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null) ?? new List<string>()
                       );

            builder.Property(q => q.Replies)
                   .HasConversion(converter)
                   .HasColumnType("LONGTEXT"); // store as string in DB


        }
    }
}


