import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import {
  verifyAccessToken,
  verifyRefreshToken,
  signAccessToken,
} from "../utils/jwt";
import RefreshToken from "../models/refreshToken";
import crypto from "crypto";
import { rotateRefreshTokenSecure } from "../services/authService";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function autoRefresh(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = req.cookies?.access_token;
    const refreshToken = req.cookies?.refresh_token;

    if (!accessToken) return next(); // no access token, let authenticate handle it

    try {
      // ✅ Try verifying access token
      verifyAccessToken(accessToken);
      return next();
    } catch (err) {
      // ⏰ If access token is expired, attempt refresh
      if (err instanceof TokenExpiredError && refreshToken) {
        try {
          // 🔁 Perform secure rotation
          const { newAccess, newRefresh, userId } =
            await rotateRefreshTokenSecure(refreshToken);

          res.cookie("access_token", newAccess, {
            ...COOKIE_OPTIONS,
            maxAge: 15 * 60 * 1000,
          });
          res.cookie("refresh_token", newRefresh, {
            ...COOKIE_OPTIONS,
            maxAge: 30 * 24 * 60 * 60 * 1000,
          });

          console.log("🔄 Secure refresh rotation for user:", userId);
          return next();
        } catch {
          return res.status(401).json({ message: "Refresh rotation failed" });
        }
      }
      // ❌ If another error, not expiration
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Auth error" });
  }
}
