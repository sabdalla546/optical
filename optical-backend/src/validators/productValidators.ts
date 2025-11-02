import { z } from "zod";

export const createProductSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["frame", "lens", "accessory", "bag"]),
  brandId: z.number().int().optional().nullable(),
  companyId: z.number().int().optional().nullable(),
  defaultCost: z.number().positive().optional().nullable(),
  subtype: z.any().optional(), // will validate below depending on type
});

export const listProductsSchema = z.object({
  type: z.enum(["frame", "lens", "accessory", "bag"]).optional(),
  branchId: z.number().int().optional(),
  q: z.string().optional(),
});
