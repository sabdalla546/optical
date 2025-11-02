import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(5),
  email: z.string().email().optional(),
  password: z.string().min(6),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  is_active: z.boolean().optional(),
});
