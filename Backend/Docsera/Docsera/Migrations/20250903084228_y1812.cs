using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Docsera.Migrations
{
    /// <inheritdoc />
    public partial class y1812 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DocName",
                table: "DoctorTicket",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateTime",
                table: "CommunityQuestion",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 9, 3, 11, 42, 28, 580, DateTimeKind.Local).AddTicks(8768),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 9, 2, 20, 31, 21, 249, DateTimeKind.Local).AddTicks(7981));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DocName",
                table: "DoctorTicket");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateTime",
                table: "CommunityQuestion",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 9, 2, 20, 31, 21, 249, DateTimeKind.Local).AddTicks(7981),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 9, 3, 11, 42, 28, 580, DateTimeKind.Local).AddTicks(8768));
        }
    }
}
