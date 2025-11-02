import BlacklistedToken from "../models/blacklistedToken";
import { Op } from "sequelize";

export async function blacklistToken(jti: string, expiresAt: Date) {
  await BlacklistedToken.create({ jti, expires_at: expiresAt });
}

export async function isTokenBlacklisted(jti: string) {
  const token = await BlacklistedToken.findOne({ where: { jti } });
  return !!token;
}

export async function cleanupExpiredBlacklistedTokens() {
  const now = new Date();
  await BlacklistedToken.destroy({ where: { expires_at: { [Op.lt]: now } } });
}
