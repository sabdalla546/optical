import User from "../models/user";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshToken";
import { Op } from "sequelize";
import { blacklistToken } from "./tokenBlacklistService";
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "../utils/jwt";
const SALT_ROUNDS = 10;

/**
 * Registers a new user.
 */
export async function registerUser({
  name,
  phone,
  email,
  password,
}: {
  name: string;
  phone: string;
  email?: string;
  password: string;
}) {
  const existing = await User.findOne({
    where: { [Op.or]: [{ email }, { phone }] },
  });
  if (existing) throw new Error("User with this email or phone already exists");

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, phone, email, password_hash });
  return user;
}

/**
 * Handles login.
 */
export async function loginUser({
  emailOrPhone,
  password,
  deviceInfo,
}: {
  emailOrPhone: string;
  password: string;
  deviceInfo?: string;
}) {
  const user =
    (await User.findOne({ where: { email: emailOrPhone } })) ||
    (await User.findOne({ where: { phone: emailOrPhone } }));

  if (!user) throw new Error("Invalid credentials");
  if (!(user as any).is_active) throw new Error("Account is inactive");

  const valid = await bcrypt.compare(password, (user as any).password_hash);
  if (!valid) throw new Error("Invalid credentials");

  const accessToken = signAccessToken({ sub: user.id });
  const refreshToken = signRefreshToken({ sub: user.id });

  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await RefreshToken.create({
    token_hash: tokenHash,
    userId: user.id,
    expires_at: expiresAt,
    device_info: deviceInfo || "unknown-device",
  });

  return {
    access: accessToken,
    refresh: refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  };
}

/**
 * Rotates a refresh token (advanced security)
 */
export async function rotateRefreshToken(oldToken: string) {
  const tokenHash = crypto.createHash("sha256").update(oldToken).digest("hex");
  const stored = await RefreshToken.findOne({
    where: { token_hash: tokenHash, revoked: false },
  });

  if (!stored) throw new Error("Invalid or expired refresh token");

  stored.revoked = true;
  await stored.save();

  const newToken = signRefreshToken({ sub: stored.getDataValue("userId") });
  const newHash = crypto.createHash("sha256").update(newToken).digest("hex");

  await RefreshToken.create({
    token_hash: newHash,
    userId: stored.getDataValue("userId"),
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });

  return newToken;
}

/**
 * Revokes refresh token (logout)
 */
export async function revokeRefreshToken(refreshToken: string) {
  const decoded: any = jwt.decode(refreshToken);
  if (decoded?.jti && decoded?.exp) {
    const expiresAt = new Date(decoded.exp * 1000);
    await blacklistToken(decoded.jti, expiresAt);
  }

  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const record = await RefreshToken.findOne({
    where: { token_hash: tokenHash },
  });
  if (record) {
    record.revoked = true;
    await record.save();
  }

  return true;
}

/**
 * Cleans up expired tokens periodically.
 */
export async function cleanupExpiredTokens() {
  const now = new Date();
  await RefreshToken.destroy({ where: { expires_at: { [Op.lt]: now } } });
}

export async function rotateRefreshTokenSecure(oldRefreshToken: string) {
  try {
    const decoded = verifyRefreshToken(oldRefreshToken);
    const userId = Number(decoded.sub); // ✅ convert from string to number

    const oldHash = crypto
      .createHash("sha256")
      .update(oldRefreshToken)
      .digest("hex");

    const stored = await RefreshToken.findOne({
      where: { token_hash: oldHash, revoked: false },
    });

    if (!stored) throw new Error("Invalid or already used refresh token");

    stored.revoked = true;
    await stored.save();

    const newRefresh = signRefreshToken({ sub: userId });
    const newAccess = signAccessToken({ sub: userId });

    const newHash = crypto
      .createHash("sha256")
      .update(newRefresh)
      .digest("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    await RefreshToken.create({
      token_hash: newHash,
      userId, // ✅ now safely a number
      expires_at: expiresAt,
      revoked: false,
    });

    return { newAccess, newRefresh, userId };
  } catch (err: any) {
    throw new Error("Refresh token rotation failed: " + err.message);
  }
}
