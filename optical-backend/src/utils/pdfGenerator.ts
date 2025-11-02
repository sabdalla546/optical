import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export interface RBACChange {
  type: "ROLE" | "PERMISSION" | "ASSIGNMENT";
  entityName: string;
  action: string;
  user?: string;
  branch?: string;
  timestamp: Date;
}

export async function generateRBACReport(
  changes: RBACChange[]
): Promise<string> {
  const doc = new PDFDocument({ margin: 40 });
  const reportsDir = path.join(process.cwd(), "reports");
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  const filename = `rbac-report-${Date.now()}.pdf`;
  const filepath = path.join(reportsDir, filename);

  doc.pipe(fs.createWriteStream(filepath));

  doc.fontSize(20).text("Daily RBAC Change Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Date: ${new Date().toLocaleString()}`);
  doc.moveDown(2);

  if (changes.length === 0) {
    doc.text("No RBAC changes were recorded in the last 24 hours.", {
      align: "center",
    });
  } else {
    changes.forEach((c, index) => {
      doc
        .font("Helvetica-Bold")
        .text(`${index + 1}. [${c.type}] ${c.entityName}`)
        .font("Helvetica")
        .text(`Action: ${c.action}`)
        .text(`Branch: ${c.branch || "N/A"}`)
        .text(`User: ${c.user || "System"}`)
        .text(`Time: ${c.timestamp.toLocaleString()}`)
        .moveDown();
    });
  }

  doc.end();
  return filepath;
}
