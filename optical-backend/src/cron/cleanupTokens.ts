import cron from "node-cron";
import { cleanupExpiredTokens } from "../services/authService";
import { cleanupExpiredBlacklistedTokens } from "../services/tokenBlacklistService";

export function startTokenCleanupJob() {
  // Run daily at midnight
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("🧹 Cleaning expired refresh tokens...");
      await cleanupExpiredTokens();
      await cleanupExpiredBlacklistedTokens();
      console.log("✅ Expired tokens cleanup complete");
    } catch (err) {
      console.error("❌ Token cleanup failed:", err);
    }
  });
}
