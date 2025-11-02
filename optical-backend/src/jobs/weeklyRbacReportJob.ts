import { Op, fn, col } from "sequelize";
import Role from "../models/role";
import Permission from "../models/permission";
import UserRole from "../models/userRole";
import Branch from "../models/branch";
import User from "../models/user";
import { generateWeeklyRbacReport } from "../utils/weeklyPdfGenerator";
import { sendEmailWithAttachment } from "../utils/emailService";
import dotenv from "dotenv";
dotenv.config();

export async function runWeeklyRbacReport() {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [roles, permissions, assignments] = await Promise.all([
      Role.count({ where: { updatedAt: { [Op.gte]: since } } }),
      Permission.count({ where: { updatedAt: { [Op.gte]: since } } }),
      UserRole.count({ where: { updatedAt: { [Op.gte]: since } } }),
    ]);

    // Aggregate users per role
    const userRoles = await UserRole.findAll({
      include: [User, Role],
    });
    const usersPerRole: Record<string, number> = {};
    userRoles.forEach((u: any) => {
      const roleName = u.Role?.name || "Unknown";
      usersPerRole[roleName] = (usersPerRole[roleName] || 0) + 1;
    });

    // Count users per branch
    const branchesData = await Branch.findAll({
      include: [{ model: User, through: { attributes: [] } }],
    });
    const branches = branchesData.map((b: any) => ({
      name: b.name,
      users: b.Users?.length || 0,
    }));

    const summary = {
      rolesChanged: roles,
      permissionsChanged: permissions,
      assignmentsChanged: assignments,
      usersPerRole,
      branches,
    };

    const pdfPath = await generateWeeklyRbacReport(summary);

    const admins =
      process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
    if (admins.length) {
      await sendEmailWithAttachment(
        admins,
        "Weekly RBAC Report",
        "Here is your weekly RBAC summary.",
        pdfPath,
        roles + permissions + assignments
      );
      console.log(`📨 Weekly RBAC report sent to: ${admins.join(", ")}`);
    } else {
      console.log("⚠️ No admin emails configured.");
    }
  } catch (err: any) {
    console.error("❌ Weekly RBAC Report job failed:", err.message);
  }
}
