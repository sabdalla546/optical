import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import UserRole from "../models/userRole";
import RolePermission from "../models/rolePermission";
import Permission from "../models/permission";

export function authorize(permissionName: string) {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user)
        return res.status(401).json({ message: "Unauthenticated" });
      const userId = req.user.id;

      // find roles assigned to user (global or branch-specific)
      const assignments = await UserRole.findAll({ where: { userId } });
      const roleIds = assignments.map((a) => a.get("roleId"));
      if (!roleIds.length)
        return res.status(403).json({ message: "Forbidden" });

      // find permission
      const permission = await Permission.findOne({
        where: { name: permissionName },
      });
      if (!permission)
        return res.status(403).json({ message: "Permission not found" });

      const rp = await RolePermission.findOne({
        where: {
          roleId: { [Op.in]: roleIds },
          permissionId: permission.get("id"),
        },
      });
      if (!rp) return res.status(403).json({ message: "Forbidden" });

      next();
    } catch (err) {
      next(err);
    }
  };
}
