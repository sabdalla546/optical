import { Op } from "sequelize";
import Role from "../models/role";
import Permission from "../models/permission";
import UserRole from "../models/userRole";
import Branch from "../models/branch";
import User from "../models/user";
import { generateRBACReport } from "../utils/pdfGenerator";
import { sendEmailWithAttachment } from "../utils/emailService";
import dotenv from "dotenv";
dotenv.config();

/**
 * Collects RBAC changes and sends daily PDF to admins.
 */
export async function runDailyRBACReport() {
  try {
    const since = new Date(Date.now() - 1000 * 60 * 60 * 24);

    const [roles, permissions, assignments] = await Promise.all([
      Role.findAll({ where: { updatedAt: { [Op.gte]: since } } }),
      Permission.findAll({ where: { updatedAt: { [Op.gte]: since } } }),
      UserRole.findAll({
        where: { updatedAt: { [Op.gte]: since } },
        include: [User, Branch],
      }),
    ]);

    const changes: any[] = [];

    roles.forEach((r) =>
      changes.push({
        type: "ROLE",
        entityName: r.getDataValue("name"),
        action: "Role updated",
        timestamp: r.getDataValue("updatedAt"),
      })
    );

    permissions.forEach((p) =>
      changes.push({
        type: "PERMISSION",
        entityName: p.getDataValue("name"),
        action: "Permission updated",
        timestamp: p.getDataValue("updatedAt"),
      })
    );

    assignments.forEach((a: any) =>
      changes.push({
        type: "ASSIGNMENT",
        entityName: `${a.User?.name} → ${a.Role?.name || "Unknown"}`,
        branch: a.Branch?.name,
        action: "Role assignment changed",
        timestamp: a.getDataValue("updatedAt"),
      })
    );

    const pdfPath = await generateRBACReport(changes);

    const admins =
      process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
    if (admins.length) {
      await sendEmailWithAttachment(
        admins,
        "Daily RBAC Change Report",
        "Attached is the daily RBAC change report for your review.",
        pdfPath
      );
      console.log(`📨 Daily RBAC report sent to: ${admins.join(", ")}`);
    } else {
      console.log("⚠️ No admin emails configured.");
    }
  } catch (err: any) {
    console.error("❌ RBAC Report job failed:", err.message);
  }
}
