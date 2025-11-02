import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import type { StringValue } from "ms"; // 👈 import correct type from 'ms'
dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT secrets are missing in environment variables");
}

/**
 * Options with proper type casting
 */
const accessOptions: SignOptions = {
  expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN || "15m") as StringValue,
};

const refreshOptions: SignOptions = {
  expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN || "30d") as StringValue,
};

/**
 * Generate Access Token
 */
export function signAccessToken(payload: object): string {
  return jwt.sign({ ...payload, jti: uuidv4() }, ACCESS_SECRET, accessOptions);
}

/**
 * Generate Refresh Token
 */
export function signRefreshToken(payload: object): string {
  return jwt.sign(
    { ...payload, jti: uuidv4() },
    REFRESH_SECRET,
    refreshOptions
  );
}

/**
 * Verify Access Token
 */
export function verifyAccessToken(
  token: string
): JwtPayload & { sub: string; jti: string } {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload & {
    sub: string;
    jti: string;
  };
}

/**
 * Verify Refresh Token
 */
export function verifyRefreshToken(
  token: string
): JwtPayload & { sub: string; jti: string } {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload & {
    sub: string;
    jti: string;
  };
}
