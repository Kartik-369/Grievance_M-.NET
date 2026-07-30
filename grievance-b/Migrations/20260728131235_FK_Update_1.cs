using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace grievance_b.Migrations
{
    /// <inheritdoc />
    public partial class FK_Update_1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_GrievanceStatusHistory_GrievanceId",
                table: "GrievanceStatusHistory",
                column: "GrievanceId");

            migrationBuilder.CreateIndex(
                name: "IX_GrievanceStatusHistory_Status",
                table: "GrievanceStatusHistory",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_GrievanceStatusHistory_UpdatedBy",
                table: "GrievanceStatusHistory",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Grievances_CategoryId",
                table: "Grievances",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Grievances_Priority",
                table: "Grievances",
                column: "Priority");

            migrationBuilder.CreateIndex(
                name: "IX_Grievances_RaisedBy",
                table: "Grievances",
                column: "RaisedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Grievances_Status",
                table: "Grievances",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_GrievanceAssignments_AssignedTo",
                table: "GrievanceAssignments",
                column: "AssignedTo");

            migrationBuilder.CreateIndex(
                name: "IX_GrievanceAssignments_GrievanceId",
                table: "GrievanceAssignments",
                column: "GrievanceId");

            migrationBuilder.AddForeignKey(
                name: "FK_GrievanceAssignments_Grievances_GrievanceId",
                table: "GrievanceAssignments",
                column: "GrievanceId",
                principalTable: "Grievances",
                principalColumn: "GrievanceId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GrievanceAssignments_Users_AssignedTo",
                table: "GrievanceAssignments",
                column: "AssignedTo",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Grievances_GrievanceCategories_CategoryId",
                table: "Grievances",
                column: "CategoryId",
                principalTable: "GrievanceCategories",
                principalColumn: "CategoryId",
                onDelete: ReferentialAction.Cascade);

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

            migrationBuilder.AddForeignKey(
                name: "FK_Grievances_Users_RaisedBy",
                table: "Grievances",
                column: "RaisedBy",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_GrievanceStatusHistory_Grievances_GrievanceId",
                table: "GrievanceStatusHistory",
                column: "GrievanceId",
                principalTable: "Grievances",
                principalColumn: "GrievanceId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GrievanceStatusHistory_Status_Status",
                table: "GrievanceStatusHistory",
                column: "Status",
                principalTable: "Status",
                principalColumn: "StatusID");

            migrationBuilder.AddForeignKey(
                name: "FK_GrievanceStatusHistory_Users_UpdatedBy",
                table: "GrievanceStatusHistory",
                column: "UpdatedBy",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "RoleId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GrievanceAssignments_Grievances_GrievanceId",
                table: "GrievanceAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_GrievanceAssignments_Users_AssignedTo",
                table: "GrievanceAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_Grievances_GrievanceCategories_CategoryId",
                table: "Grievances");

            migrationBuilder.DropForeignKey(
                name: "FK_Grievances_Priority_Priority",
                table: "Grievances");

            migrationBuilder.DropForeignKey(
                name: "FK_Grievances_Status_Status",
                table: "Grievances");

            migrationBuilder.DropForeignKey(
                name: "FK_Grievances_Users_RaisedBy",
                table: "Grievances");

            migrationBuilder.DropForeignKey(
                name: "FK_GrievanceStatusHistory_Grievances_GrievanceId",
                table: "GrievanceStatusHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_GrievanceStatusHistory_Status_Status",
                table: "GrievanceStatusHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_GrievanceStatusHistory_Users_UpdatedBy",
                table: "GrievanceStatusHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_RoleId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_GrievanceStatusHistory_GrievanceId",
                table: "GrievanceStatusHistory");

            migrationBuilder.DropIndex(
                name: "IX_GrievanceStatusHistory_Status",
                table: "GrievanceStatusHistory");

            migrationBuilder.DropIndex(
                name: "IX_GrievanceStatusHistory_UpdatedBy",
                table: "GrievanceStatusHistory");

            migrationBuilder.DropIndex(
                name: "IX_Grievances_CategoryId",
                table: "Grievances");

            migrationBuilder.DropIndex(
                name: "IX_Grievances_Priority",
                table: "Grievances");

            migrationBuilder.DropIndex(
                name: "IX_Grievances_RaisedBy",
                table: "Grievances");

            migrationBuilder.DropIndex(
                name: "IX_Grievances_Status",
                table: "Grievances");

            migrationBuilder.DropIndex(
                name: "IX_GrievanceAssignments_AssignedTo",
                table: "GrievanceAssignments");

            migrationBuilder.DropIndex(
                name: "IX_GrievanceAssignments_GrievanceId",
                table: "GrievanceAssignments");
        }
    }
}
