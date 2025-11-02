import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { sequelize } from "./models";
import { seedDefaultAdmin } from "./seeders/dminSeeder";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import branchRoutes from "./routes/branches";
import addressRoutes from "./routes/addresses";
import branchUserRoutes from "./routes/branchUsers";
import branchRoleUIRoutes from "./routes/branchRoleUI";
import branchRolePermissionRoutes from "./routes/branchRolePermission";
import reportRoutes from "./routes/reportRoutes";

import productRoutes from "./routes/products";
import stockRoutes from "./routes/stock";
import { runWeeklyRbacReport } from "./jobs/weeklyRbacReportJob";

import cron from "node-cron";
import { runDailyRBACReport } from "./jobs/rbacReportJob";
import { autoRefresh } from "./middleware/autoRefresh"; // ✅ new

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(autoRefresh);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/branches", branchRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/branches", branchUserRoutes);
app.use("/api/v1", branchRoleUIRoutes);
app.use("/api/v1", branchRolePermissionRoutes);
app.use("/api/v1", reportRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/stock", stockRoutes);
app.get("/health", (_, res) => res.json({ ok: true }));

cron.schedule("0 8 * * *", async () => {
  console.log("🕗 Running Daily RBAC Report Job...");
  await runDailyRBACReport();
});

cron.schedule("0 8 * * 0", async () => {
  console.log("📅 Running Weekly RBAC Report Job...");
  await runWeeklyRbacReport();
});
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    await sequelize.sync({ alter: true });
    await seedDefaultAdmin();
  } catch (err) {
    console.error("❌ Database connection failed", err);
  }
})();

export default app;
