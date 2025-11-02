import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import * as ctrl from "../controllers/branchRolePermissionController";

const router = Router();

router.get(
  "/permissions",
  authenticate,
  authorize("view_permissions"),
  ctrl.listAllPermissions
);

router.get(
  "/branches/:branchId/roles/:roleId/permissions",
  authenticate,
  authorize("manage_roles"),
  ctrl.getRolePermissions
);

router.post(
  "/branches/:branchId/roles/:roleId/permissions",
  authenticate,
  authorize("manage_roles"),
  ctrl.syncRolePermissions
);

export default router;
