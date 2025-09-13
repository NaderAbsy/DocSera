using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Docsera.Migrations
{
    /// <inheritdoc />
    public partial class AddRate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DateTime",
                table: "CommunityQuestion",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 9, 1, 10, 40, 14, 635, DateTimeKind.Local).AddTicks(4857),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 8, 27, 17, 39, 22, 796, DateTimeKind.Local).AddTicks(7964));

            migrationBuilder.CreateTable(
                name: "Rate",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    OverAllRate = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rate", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Rate");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateTime",
                table: "CommunityQuestion",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 8, 27, 17, 39, 22, 796, DateTimeKind.Local).AddTicks(7964),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 9, 1, 10, 40, 14, 635, DateTimeKind.Local).AddTicks(4857));
        }
    }
}
