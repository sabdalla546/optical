import { z } from "zod";

export const receiveStockSchema = z.object({
  productId: z.number().int(),
  quantity: z.number().int().positive(),
  unitCost: z.number().positive(),
  reference: z.string().optional(),
});

export const adjustStockSchema = z.object({
  productId: z.number().int(),
  change: z.number().int(), // positive or negative
  reason: z.string().optional(),
  unitCost: z.number().optional(), // used if positive to recalc
});

export const transferStockSchema = z.object({
  productId: z.number().int(),
  fromBranchId: z.number().int(),
  toBranchId: z.number().int(),
  quantity: z.number().int().positive(),
  reference: z.string().optional(),
});
