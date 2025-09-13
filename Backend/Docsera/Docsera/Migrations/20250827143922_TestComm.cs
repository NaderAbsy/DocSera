using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Docsera.Migrations
{
    /// <inheritdoc />
    public partial class TestComm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DateTime",
                table: "CommunityQuestion",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 8, 27, 17, 39, 22, 796, DateTimeKind.Local).AddTicks(7964),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 8, 27, 17, 36, 41, 954, DateTimeKind.Local).AddTicks(4428));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DateTime",
                table: "CommunityQuestion",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 8, 27, 17, 36, 41, 954, DateTimeKind.Local).AddTicks(4428),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 8, 27, 17, 39, 22, 796, DateTimeKind.Local).AddTicks(7964));
        }
    }
}
