import { Router } from "express";
import * as stockCtrl from "../controllers/stockController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.post(
  "/:branchId/receive",
  authenticate,
  authorize("manage_inventory"),
  stockCtrl.receiveStock
);
router.post(
  "/:branchId/adjust",
  authenticate,
  authorize("manage_inventory"),
  stockCtrl.adjustStock
);
router.post(
  "/transfer",
  authenticate,
  authorize("manage_inventory"),
  stockCtrl.transferStock
);

router.get(
  "/:branchId",
  authenticate,
  authorize("view_inventory"),
  stockCtrl.listStock
);
router.get(
  "/:branchId/:productId",
  authenticate,
  authorize("view_inventory"),
  stockCtrl.getStock
);

export default router;
