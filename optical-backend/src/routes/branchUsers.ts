import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import * as branchUserCtrl from "../controllers/branchUserController";

const router = Router();

router.post(
  "/:branchId/assign-user/:userId",
  authenticate,
  authorize("manage_roles"),
  branchUserCtrl.assignUserToBranch
);

router.delete(
  "/:branchId/unassign-user/:userId",
  authenticate,
  authorize("manage_roles"),
  branchUserCtrl.unassignUserFromBranch
);

router.get(
  "/:branchId/users",
  authenticate,
  authorize("view_users"),
  branchUserCtrl.listBranchUsers
);

export default router;
