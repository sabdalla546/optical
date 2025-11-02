import { Request, Response } from "express";
import { z } from "zod";
import Branch from "../models/branch";
import User from "../models/user";
import Role from "../models/role";
import UserRole from "../models/userRole";
import { AuthRequest } from "../middleware/auth";

/**
 * GET /api/v1/branches/with-users
 * Lists all branches with their assigned users & roles.
 */
export async function listBranchesWithUsers(req: AuthRequest, res: Response) {
  try {
    const branches = await Branch.findAll({
      include: [
        {
          model: UserRole,
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email", "phone"],
            },
            { model: Role, as: "role", attributes: ["id", "name"] },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });

    const result = branches.map((b: any) => ({
      id: b.id,
      name: b.name,
      phone: b.phone,
      users: b.user_roles?.map((ur: any) => ({
        id: ur.user.id,
        name: ur.user.name,
        phone: ur.user.phone,
        email: ur.user.email,
        role: ur.role?.name || "Unassigned",
      })),
    }));

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

/**
 * GET /api/v1/users/:userId/branches
 * Lists all branches and roles assigned to a user.
 */
export async function listUserBranches(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const assignments = await UserRole.findAll({
      where: { userId },
      include: [
        { model: Branch, attributes: ["id", "name", "phone"] },
        { model: Role, attributes: ["id", "name"] },
      ],
    });

    res.json(
      assignments.map((a: any) => ({
        branch: a.Branch,
        role: a.Role,
      }))
    );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

/**
 * GET /api/v1/branches/:branchId/roles
 * Lists all available roles for assignment in a branch.
 */
export async function listBranchRoles(req: Request, res: Response) {
  try {
    const roles = await Role.findAll({
      attributes: ["id", "name", "description"],
    });
    res.json(roles);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

/**
 * POST /api/v1/branches/:branchId/assign-role
 * Assigns a user to a branch with a specific role.
 */
export async function assignRoleToUser(req: AuthRequest, res: Response) {
  try {
    const schema = z.object({
      userId: z.number(),
      roleId: z.number(),
    });

    const { userId, roleId } = schema.parse(req.body);
    const { branchId } = req.params;

    const branch = await Branch.findByPk(branchId);
    if (!branch) return res.status(404).json({ message: "Branch not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const role = await Role.findByPk(roleId);
    if (!role) return res.status(404).json({ message: "Role not found" });

    const existing = await UserRole.findOne({
      where: { userId, branchId, roleId },
    });

    if (existing)
      return res.status(400).json({
        message: "User already assigned to this branch with this role",
      });

    await UserRole.create({ userId, roleId, branchId });
    res.status(201).json({ ok: true, message: "Role assigned successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

/**
 * DELETE /api/v1/branches/:branchId/remove-role/:userId
 * Removes a user's role assignment from a branch.
 */
export async function removeUserRoleFromBranch(req: Request, res: Response) {
  try {
    const { branchId, userId } = req.params;
    const assignment = await UserRole.findOne({ where: { userId, branchId } });

    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    await assignment.destroy();
    res.json({ ok: true, message: "User removed from branch" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
