using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace grievance_b.Migrations
{
    /// <inheritdoc />
    public partial class FK_Update_S : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Grievances_Priority_Priority",
                table: "Grievances");

            migrationBuilder.DropForeignKey(
                name: "FK_Grievances_Status_Status",
                table: "Grievances");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Grievances",
                newName: "StatusId");

            migrationBuilder.RenameColumn(
                name: "Priority",
                table: "Grievances",
                newName: "PriorityId");

            migrationBuilder.RenameIndex(
                name: "IX_Grievances_Status",
                table: "Grievances",
                newName: "IX_Grievances_StatusId");

            migrationBuilder.RenameIndex(
                name: "IX_Grievances_Priority",
                table: "Grievances",
                newName: "IX_Grievances_PriorityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Grievances_Priority_PriorityId",
                table: "Grievances",
                column: "PriorityId",
                principalTable: "Priority",
                principalColumn: "PriorityId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Grievances_Status_StatusId",
                table: "Grievances",
                column: "StatusId",
                principalTable: "Status",
                principalColumn: "StatusID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Grievances_Priority_PriorityId",
                table: "Grievances");

            migrationBuilder.DropForeignKey(
                name: "FK_Grievances_Status_StatusId",
                table: "Grievances");

            migrationBuilder.RenameColumn(
                name: "StatusId",
                table: "Grievances",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "PriorityId",
                table: "Grievances",
                newName: "Priority");

            migrationBuilder.RenameIndex(
                name: "IX_Grievances_StatusId",
                table: "Grievances",
                newName: "IX_Grievances_Status");

            migrationBuilder.RenameIndex(
                name: "IX_Grievances_PriorityId",
                table: "Grievances",
                newName: "IX_Grievances_Priority");

            migrationBuilder.AddForeignKey(
                name: "FK_Grievances_Priority_Priority",
                table: "Grievances",
                column: "Priority",
                principalTable: "Priority",
                principalColumn: "PriorityId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Grievances_Status_Status",
                table: "Grievances",
                column: "Status",
                principalTable: "Status",
                principalColumn: "StatusID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
