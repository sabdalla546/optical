import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { generateChartImage } from "./chartHelper";

interface WeeklySummary {
  rolesChanged: number;
  permissionsChanged: number;
  assignmentsChanged: number;
  usersPerRole: Record<string, number>;
  branches: { name: string; users: number }[];
}

export async function generateWeeklyRbacReport(
  summary: WeeklySummary
): Promise<string> {
  const doc = new PDFDocument({ margin: 40 });
  const reportsDir = path.join(process.cwd(), "reports");
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  const filename = `weekly-rbac-report-${Date.now()}.pdf`;
  const filepath = path.join(reportsDir, filename);
  doc.pipe(fs.createWriteStream(filepath));

  doc.fontSize(20).text("Weekly Consolidated RBAC Report", { align: "center" });
  doc.moveDown().fontSize(12);
  doc.text(`Date Range: ${new Date().toLocaleDateString()}`);
  doc.moveDown(2);

  doc.text("Summary:");
  doc.list([
    `Roles changed: ${summary.rolesChanged}`,
    `Permissions changed: ${summary.permissionsChanged}`,
    `Role assignments changed: ${summary.assignmentsChanged}`,
  ]);
  doc.moveDown();

  // Charts
  const roleChart = await generateChartImage(
    "Users per Role",
    Object.keys(summary.usersPerRole),
    Object.values(summary.usersPerRole),
    "bar"
  );
  const branchChart = await generateChartImage(
    "Users per Branch",
    summary.branches.map((b) => b.name),
    summary.branches.map((b) => b.users),
    "pie"
  );

  doc.image(roleChart, { width: 500, align: "center" });
  doc.moveDown();
  doc.image(branchChart, { width: 400, align: "center" });

  doc.moveDown();
  doc.text("Generated automatically by the Optical Shop Management System.", {
    align: "center",
    fontSize: 10,
  });

  doc.end();
  return filepath;
}
