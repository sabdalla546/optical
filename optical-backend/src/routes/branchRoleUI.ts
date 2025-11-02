import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import * as ctrl from "../controllers/branchRoleUIController";

const router = Router();

router.get(
  "/branches/with-users",
  authenticate,
  authorize("view_users"),
  ctrl.listBranchesWithUsers
);

router.get(
  "/users/:userId/branches",
  authenticate,
  authorize("view_users"),
  ctrl.listUserBranches
);

router.get(
  "/branches/:branchId/roles",
  authenticate,
  authorize("manage_roles"),
  ctrl.listBranchRoles
);

router.post(
  "/branches/:branchId/assign-role",
  authenticate,
  authorize("manage_roles"),
  ctrl.assignRoleToUser
);

router.delete(
  "/branches/:branchId/remove-role/:userId",
  authenticate,
  authorize("manage_roles"),
  ctrl.removeUserRoleFromBranch
);

export default router;
