using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Docsera.Migrations
{
    /// <inheritdoc />
    public partial class yazan12212 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DateTime",
                table: "CommunityQuestion",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 9, 2, 20, 31, 21, 249, DateTimeKind.Local).AddTicks(7981),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 9, 1, 11, 34, 50, 486, DateTimeKind.Local).AddTicks(4781));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DateTime",
                table: "CommunityQuestion",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 9, 1, 11, 34, 50, 486, DateTimeKind.Local).AddTicks(4781),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 9, 2, 20, 31, 21, 249, DateTimeKind.Local).AddTicks(7981));
        }
    }
}
