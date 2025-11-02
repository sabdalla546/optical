import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export async function getLatestRBACReport(req: Request, res: Response) {
  try {
    const reportsDir = path.join(process.cwd(), "reports");
    if (!fs.existsSync(reportsDir)) {
      return res.status(404).json({ message: "No reports found." });
    }

    const files = fs
      .readdirSync(reportsDir)
      .filter((f) => f.endsWith(".pdf"))
      .sort((a, b) => {
        const aTime = fs.statSync(path.join(reportsDir, a)).mtime.getTime();
        const bTime = fs.statSync(path.join(reportsDir, b)).mtime.getTime();
        return bTime - aTime;
      });

    if (files.length === 0)
      return res.status(404).json({ message: "No RBAC reports found." });

    const latestFile = path.join(reportsDir, files[0]);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${files[0]}"`);
    fs.createReadStream(latestFile).pipe(res);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
