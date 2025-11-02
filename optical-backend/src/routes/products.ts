import { Router } from "express";
import * as productCtrl from "../controllers/productController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("manage_inventory"),
  productCtrl.createProduct
);
router.get(
  "/",
  authenticate,
  authorize("view_inventory"),
  productCtrl.listProducts
);
router.get(
  "/:id",
  authenticate,
  authorize("view_inventory"),
  productCtrl.getProduct
);

export default router;
