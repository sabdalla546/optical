import { Request, Response } from "express";
import * as authService from "../services/authService";
import { z } from "zod";
import {
  registerSchema,
  loginSchema,
  // refreshSchema,
  //logoutSchema,
} from "../validators/authValidators";
// import { verifyRefreshToken, signAccessToken } from "../utils/jwt";
// import RefreshToken from "../models/refreshToken";
//import crypto from "crypto";

import { rotateRefreshTokenSecure } from "../services/authService";
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};
// Register
export async function register(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body);
    const user = await authService.registerUser(data);
    res.status(201).json({ id: user.id, name: user.name, phone: user.phone });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

// Login
export async function login(req: Request, res: Response) {
  try {
    const { emailOrPhone, password, deviceInfo } = loginSchema.parse(req.body);
    const { access, refresh, user } = await authService.loginUser({
      emailOrPhone,
      password,
      deviceInfo,
    });

    res
      .cookie("access_token", access, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000, // 15 min
      })
      .cookie("refresh_token", refresh, {
        ...COOKIE_OPTIONS,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
      .json({ user });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

// Refresh
export async function refresh(req: Request, res: Response) {
  try {
    const oldRefresh = req.cookies?.refresh_token;
    if (!oldRefresh) throw new Error("Missing refresh token");

    const { newAccess, newRefresh, userId } = await rotateRefreshTokenSecure(
      oldRefresh
    );

    res
      .cookie("access_token", newAccess, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie("refresh_token", newRefresh, {
        ...COOKIE_OPTIONS,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
      .json({ ok: true, userId });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
}
// Logout
export async function logout(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (refreshToken) await authService.revokeRefreshToken(refreshToken);

    res
      .clearCookie("access_token", COOKIE_OPTIONS)
      .clearCookie("refresh_token", COOKIE_OPTIONS)
      .json({ ok: true, message: "Logged out" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

// Rotate
export async function rotate(req: Request, res: Response) {
  try {
    const schema = z.object({ refreshToken: z.string() });
    const { refreshToken } = schema.parse(req.body);
    const newToken = await authService.rotateRefreshToken(refreshToken);
    res.json({ refreshToken: newToken });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
