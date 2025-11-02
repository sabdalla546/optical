import { Router } from "express";
import * as addressCtrl from "../controllers/addressController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

// Example RBAC permissions: "manage_branches" or "manage_addresses"
router.post(
  "/",
  authenticate,
  authorize("manage_branches"),
  addressCtrl.createAddress
);
router.get(
  "/",
  authenticate,
  authorize("view_branches"),
  addressCtrl.listAddresses
);
router.get(
  "/:id",
  authenticate,
  authorize("view_branches"),
  addressCtrl.getAddress
);
router.patch(
  "/:id",
  authenticate,
  authorize("manage_branches"),
  addressCtrl.updateAddress
);
router.delete(
  "/:id",
  authenticate,
  authorize("manage_branches"),
  addressCtrl.deleteAddress
);

export default router;
