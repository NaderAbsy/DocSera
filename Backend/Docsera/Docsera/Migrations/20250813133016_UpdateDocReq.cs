using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Docsera.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDocReq : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsApproval",
                table: "DoctorReq");

            migrationBuilder.AddColumn<string>(
                name: "AdminMassage",
                table: "DoctorReq",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "state",
                table: "DoctorReq",
                type: "longtext",
                nullable: false,
                defaultValue: "Pending")
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdminMassage",
                table: "DoctorReq");

            migrationBuilder.DropColumn(
                name: "state",
                table: "DoctorReq");

            migrationBuilder.AddColumn<bool>(
                name: "IsApproval",
                table: "DoctorReq",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }
    }
}
