using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlbaApi.Migrations
{
    public partial class AddTheAlberDifference : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AlberDifferences",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Icon = table.Column<string>(type: "TEXT", nullable: false),
                    BadgeName = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlberDifferences", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "AlberDifferences",
                columns: new[] { "Id", "BadgeName", "CreatedAt", "Description", "Icon", "Name", "SortOrder", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "ECDE · PP1 & PP2", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Our trained ECD specialists guide children aged 2–5 through structured play, sensory discovery, and social development — laying a confident foundation before formal schooling begins.", "🎓", "Play-Based Early Years", 1, null },
                    { 2, "Primary · Grades 1–6", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Learner-centred, project-based CBC teaching builds strong literacy, numeracy, and critical thinking. Continuous assessment replaces high-stakes exams — every child progresses at their own pace.", "📚", "CBC Literacy & Numeracy Excellence", 2, null },
                    { 3, "Junior Secondary · Grades 7–9", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Kenya's CBC Junior Secondary curriculum with dedicated STEM labs, career pathway exploration, Community Service Learning (CSL), and Career & Technical Skills — preparing learners for a modern economy.", "🔬", "STEM, Careers & Community", 3, null },
                    { 4, "Senior School · Grades 10–12", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Rigorous KCSE preparation alongside optional Cambridge IGCSE & A-Level tracks. Dedicated university counselling from Grade 10 — graduates placed in Kenyan and international universities.", "🎯", "KCSE & IGCSE University Pathways", 4, null },
                    { 5, "All Levels", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Every learner — from PP1 to Grade 12 — participates in sports, music, drama, or dance. Our professional coaches and ABRSM-registered music teachers develop talent alongside academics.", "🏅", "Holistic Co-Curricular Life", 5, null },
                    { 6, "All Levels", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "TSC-registered teachers, CCTV-monitored classrooms, a fully fenced campus, and a maximum of 30 learners per class — a structured, safe environment where every child is known by name.", "🛡️", "Safe, Certified & Fully Staffed", 6, null }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AlberDifferences");
        }
    }
}
