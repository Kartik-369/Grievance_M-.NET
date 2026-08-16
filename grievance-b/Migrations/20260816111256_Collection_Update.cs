using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace grievance_b.Migrations
{
    /// <inheritdoc />
    public partial class Collection_Update : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StatusID",
                table: "GrievanceStatusHistory",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "GrievanceAssignments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GrievanceStatusHistory_StatusID",
                table: "GrievanceStatusHistory",
                column: "StatusID");

            migrationBuilder.CreateIndex(
                name: "IX_GrievanceAssignments_UserId",
                table: "GrievanceAssignments",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_GrievanceAssignments_Users_UserId",
                table: "GrievanceAssignments",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_GrievanceStatusHistory_Status_StatusID",
                table: "GrievanceStatusHistory",
                column: "StatusID",
                principalTable: "Status",
                principalColumn: "StatusID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GrievanceAssignments_Users_UserId",
                table: "GrievanceAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_GrievanceStatusHistory_Status_StatusID",
                table: "GrievanceStatusHistory");

            migrationBuilder.DropIndex(
                name: "IX_GrievanceStatusHistory_StatusID",
                table: "GrievanceStatusHistory");

            migrationBuilder.DropIndex(
                name: "IX_GrievanceAssignments_UserId",
                table: "GrievanceAssignments");

            migrationBuilder.DropColumn(
                name: "StatusID",
                table: "GrievanceStatusHistory");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "GrievanceAssignments");
        }
    }
}
