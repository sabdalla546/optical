import { z } from "zod";

export const createAddressSchema = z.object({
  governorate: z.string().min(1),
  area: z.string().min(1),
  street: z.string().optional().nullable(),
});

export const createBranchSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional().nullable(),
  address_id: z.number().int().optional().nullable(),
  address_text: z.string().optional().nullable(),
  address: createAddressSchema.optional(),
  created_by: z.number().int().optional().nullable(),
});

export const updateBranchSchema = createBranchSchema.partial();
