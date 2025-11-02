import { Router } from "express";
import * as branchCtrl from "../controllers/branchController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("manage_branches"),
  branchCtrl.createBranch
);
router.get(
  "/",
  authenticate,
  authorize("view_branches"),
  branchCtrl.listBranches
);
router.get(
  "/:id",
  authenticate,
  authorize("view_branches"),
  branchCtrl.getBranch
);
router.patch(
  "/:id",
  authenticate,
  authorize("manage_branches"),
  branchCtrl.updateBranch
);
router.delete(
  "/:id",
  authenticate,
  authorize("manage_branches"),
  branchCtrl.deleteBranch
);

export default router;
