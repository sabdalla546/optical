import { Request, Response } from "express";
import { z } from "zod";
import Role from "../models/role";
import Permission from "../models/permission";
import RolePermission from "../models/rolePermission";
import Branch from "../models/branch";

/**
 * GET /api/v1/branches/:branchId/roles/:roleId/permissions
 * Fetch permissions assigned to a role in a branch.
 */
export async function getRolePermissions(req: Request, res: Response) {
  try {
    const { branchId, roleId } = req.params;

    // Validate role & branch existence
    const branch = await Branch.findByPk(branchId);
    const role = await Role.findByPk(roleId);
    if (!branch) return res.status(404).json({ message: "Branch not found" });
    if (!role) return res.status(404).json({ message: "Role not found" });

    // Fetch all permissions
    const allPerms = await Permission.findAll({ attributes: ["id", "name"] });

    // Fetch assigned permissions for this role
    const assigned = await RolePermission.findAll({
      where: { roleId },
      attributes: ["permissionId"],
    });
    const assignedIds = assigned.map((rp) => rp.getDataValue("permissionId"));

    // Return permissions grouped as assigned/unassigned
    const result = allPerms.map((perm) => ({
      id: perm.id,
      name: perm.name,
      assigned: assignedIds.includes(perm.id),
    }));

    res.json({ branchId, roleId, permissions: result });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

/**
 * POST /api/v1/branches/:branchId/roles/:roleId/permissions
 * Sync permissions for a role (assign or remove multiple at once)
 */
export async function syncRolePermissions(req: Request, res: Response) {
  try {
    const { branchId, roleId } = req.params;
    const schema = z.object({
      permissionIds: z.array(z.number()).nonempty(),
    });
    const { permissionIds } = schema.parse(req.body);

    const branch = await Branch.findByPk(branchId);
    const role = await Role.findByPk(roleId);
    if (!branch) return res.status(404).json({ message: "Branch not found" });
    if (!role) return res.status(404).json({ message: "Role not found" });

    // Fetch existing role-permission mappings
    const existing = await RolePermission.findAll({
      where: { roleId },
    });
    const existingIds = existing.map((r) => r.getDataValue("permissionId"));

    // Determine which permissions to add or remove
    const toAdd = permissionIds.filter((id) => !existingIds.includes(id));
    const toRemove = existingIds.filter((id) => !permissionIds.includes(id));

    // Add new permissions
    for (const id of toAdd) {
      await RolePermission.create({ roleId, permissionId: id });
    }

    // Remove old permissions
    if (toRemove.length) {
      await RolePermission.destroy({
        where: { roleId, permissionId: toRemove },
      });
    }

    res.json({
      ok: true,
      added: toAdd,
      removed: toRemove,
      message: "Permissions synced successfully",
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

/**
 * GET /api/v1/permissions
 * Lists all available permissions in the system.
 */
export async function listAllPermissions(req: Request, res: Response) {
  try {
    const permissions = await Permission.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });
    res.json(permissions);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
