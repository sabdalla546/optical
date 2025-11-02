import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { getLatestRBACReport } from "../controllers/reportController";

const router = Router();

router.get(
  "/reports/rbac/daily",
  authenticate,
  authorize("view_reports"),
  getLatestRBACReport
);

export default router;
