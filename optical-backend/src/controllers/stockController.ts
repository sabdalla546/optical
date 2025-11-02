import { AuthRequest } from "../middleware/auth";
import { Request, Response } from "express";
import {
  receiveStockSchema,
  adjustStockSchema,
  transferStockSchema,
} from "../validators/stockValidators";
import * as stockService from "../services/stockService";

export async function receiveStock(req: AuthRequest, res: Response) {
  try {
    const branchId = Number(req.params.branchId);
    const data = receiveStockSchema.parse(req.body);
    const stock = await stockService.receiveStock({
      branchId,
      productId: data.productId,
      quantity: data.quantity,
      unitCost: data.unitCost,
      reference: data.reference,
      createdBy: req.user?.id,
    });
    res.json(stock);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function adjustStock(req: AuthRequest, res: Response) {
  try {
    const branchId = Number(req.params.branchId);
    const data = adjustStockSchema.parse(req.body);
    const stock = await stockService.adjustStock({
      branchId,
      productId: data.productId,
      change: data.change,
      unitCost: data.unitCost,
      createdBy: req.user?.id,
      reason: data.reason,
    });
    res.json(stock);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function transferStock(req: AuthRequest, res: Response) {
  try {
    const data = transferStockSchema.parse(req.body);
    const result = await stockService.transferStock({
      productId: data.productId,
      fromBranchId: data.fromBranchId,
      toBranchId: data.toBranchId,
      quantity: data.quantity,
      createdBy: req.user?.id,
      reference: data.reference,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function listStock(req: Request, res: Response) {
  try {
    const branchId = Number(req.params.branchId);
    const list = await stockService.listStockForBranch(branchId);
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function getStock(req: Request, res: Response) {
  try {
    const branchId = Number(req.params.branchId);
    const productId = Number(req.params.productId);
    const s = await stockService.getStock(branchId, productId);
    if (!s) return res.status(404).json({ message: "Stock not found" });
    res.json(s);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
