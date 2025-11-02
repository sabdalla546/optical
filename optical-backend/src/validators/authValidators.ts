import { z } from "zod";

// Registration validation
export const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(5, "Phone number must be valid"),
  email: z.string().email({ message: "Invalid email format" }).optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Login validation
export const loginSchema = z.object({
  emailOrPhone: z.string().min(3, "Email or phone is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  deviceInfo: z.string().optional(),
});

// Refresh token validation
export const refreshSchema = z.object({
  refreshToken: z.string({ required_error: "Refresh token is required" }),
});

// Logout validation
export const logoutSchema = z.object({
  refreshToken: z.string({ required_error: "Refresh token is required" }),
});
