using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Docsera.Migrations
{
    /// <inheritdoc />
    public partial class FixDoctorReq : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "DoctorReq",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateTime",
                table: "CommunityQuestion",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 9, 1, 11, 34, 50, 486, DateTimeKind.Local).AddTicks(4781),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 9, 1, 10, 40, 14, 635, DateTimeKind.Local).AddTicks(4857));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Password",
                table: "DoctorReq");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateTime",
                table: "CommunityQuestion",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 9, 1, 10, 40, 14, 635, DateTimeKind.Local).AddTicks(4857),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 9, 1, 11, 34, 50, 486, DateTimeKind.Local).AddTicks(4781));
        }
    }
}
