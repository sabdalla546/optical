import { Request, Response } from "express";
import Address from "../models/address";
import { z } from "zod";

const addressSchema = z.object({
  governorate: z.string().min(1),
  area: z.string().min(1),
  street: z.string().optional().nullable(),
});

// Create
export async function createAddress(req: Request, res: Response) {
  try {
    const data = addressSchema.parse(req.body);
    const address = await Address.create(data);
    res.status(201).json(address);
  } catch (err: unknown) {
    if (err instanceof Error) res.status(400).json({ message: err.message });
    else res.status(400).json({ message: "Unknown error" });
  }
}

// List all
export async function listAddresses(req: Request, res: Response) {
  const addresses = await Address.findAll({ order: [["createdAt", "DESC"]] });
  res.json(addresses);
}

// Get single
export async function getAddress(req: Request, res: Response) {
  const address = await Address.findByPk(req.params.id);
  if (!address) return res.status(404).json({ message: "Address not found" });
  res.json(address);
}

// Update
export async function updateAddress(req: Request, res: Response) {
  try {
    const data = addressSchema.partial().parse(req.body);
    const address = await Address.findByPk(req.params.id);
    if (!address) return res.status(404).json({ message: "Address not found" });
    await address.update(data);
    res.json({ ok: true });
  } catch (err: unknown) {
    if (err instanceof Error) res.status(400).json({ message: err.message });
    else res.status(400).json({ message: "Unknown error" });
  }
}

// Delete
export async function deleteAddress(req: Request, res: Response) {
  const address = await Address.findByPk(req.params.id);
  if (!address) return res.status(404).json({ message: "Address not found" });
  await address.destroy();
  res.json({ ok: true });
}
