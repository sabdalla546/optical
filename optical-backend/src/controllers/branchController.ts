import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  createBranchSchema,
  updateBranchSchema,
} from "../validators/branchValidators";
import Branch from "../models/branch";
import Address from "../models/address";
import { Op } from "sequelize";

export async function createBranch(req: AuthRequest, res: Response) {
  try {
    const data = createBranchSchema.parse(req.body);

    // if address object provided, create address
    if (data.address) {
      const addr = await Address.create(data.address);
      data.address_id = addr.id;
    }

    const branch = await Branch.create({
      name: data.name,
      phone: data.phone,
      address_id: data.address_id || null,
      address_text: data.address_text || null,
      created_by: req.user?.id || null,
    });

    res.status(201).json(branch);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function listBranches(req: AuthRequest, res: Response) {
  const branches = await Branch.findAll({
    include: [{ model: Address, as: "address" }],
    order: [["createdAt", "DESC"]],
  });
  res.json(branches);
}

export async function getBranch(req: AuthRequest, res: Response) {
  const branch = await Branch.findByPk(req.params.id, {
    include: [{ model: Address, as: "address" }],
  });
  if (!branch) return res.status(404).json({ message: "Branch not found" });
  res.json(branch);
}

export async function updateBranch(req: AuthRequest, res: Response) {
  try {
    const data = updateBranchSchema.parse(req.body);
    const branch = await Branch.findByPk(req.params.id);
    if (!branch) return res.status(404).json({ message: "Branch not found" });

    if (data.address) {
      // update or create address
      if (branch.address_id) {
        const addr = await Address.findByPk(branch.address_id);
        if (addr) await addr.update(data.address);
      } else {
        const newAddr = await Address.create(data.address);
        data.address_id = newAddr.id;
      }
    }

    await branch.update({
      ...data,
    });

    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function deleteBranch(req: AuthRequest, res: Response) {
  const branch = await Branch.findByPk(req.params.id);
  if (!branch) return res.status(404).json({ message: "Branch not found" });
  await branch.destroy();
  res.json({ ok: true });
}
