import { Request, Response } from "express";
import { z } from "zod";
import User from "../models/user";
import Branch from "../models/branch";
import Role from "../models/role";
import UserRole from "../models/userRole";
import { AuthRequest } from "../middleware/auth";

const assignSchema = z.object({
  roleId: z.number().int().optional().nullable(),
});

export async function assignUserToBranch(req: AuthRequest, res: Response) {
  try {
    const { branchId, userId } = req.params;
    const { roleId } = assignSchema.parse(req.body);

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const branch = await Branch.findByPk(branchId);
    if (!branch) return res.status(404).json({ message: "Branch not found" });

    let role = null;
    if (roleId) {
      role = await Role.findByPk(roleId);
      if (!role) return res.status(404).json({ message: "Role not found" });
    }

    // Check if this assignment already exists
    const existing = await UserRole.findOne({
      where: {
        userId: user.id,
        branchId: Number(branchId),
        ...(roleId ? { roleId } : {}),
      },
    });

    if (existing) {
      return res
        .status(400)
        .json({
          message: "User already assigned to this branch with this role",
        });
    }

    await UserRole.create({
      userId: user.id,
      roleId: role ? role.id : null,
      branchId: Number(branchId),
    });

    res.status(201).json({
      ok: true,
      message: `Assigned ${user.name} to branch ${branch.name}${
        role ? ` as ${role.name}` : ""
      }`,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: "Unknown error occurred" });
    }
  }
}

/**
 * Optionally, allow unassigning a user from a branch
 */
export async function unassignUserFromBranch(req: AuthRequest, res: Response) {
  try {
    const { branchId, userId } = req.params;
    const assignment = await UserRole.findOne({
      where: { userId: userId, branchId: branchId },
    });

    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    await assignment.destroy();
    res.json({ ok: true, message: "User unassigned from branch" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: "Unknown error occurred" });
    }
  }
}

/**
 * List all users for a specific branch
 */
export async function listBranchUsers(req: AuthRequest, res: Response) {
  const { branchId } = req.params;
  const users = await UserRole.findAll({
    where: { branchId },
    include: [
      { model: User, as: "user", attributes: ["id", "name", "email", "phone"] },
      { model: Role, as: "role", attributes: ["id", "name"] },
    ],
  });
  res.json(users);
}
