import { Router } from "express";
import * as userCtrl from "../controllers/userController";
import { upload } from "../middleware/upload";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/", authenticate, userCtrl.createUser);
router.get("/", authenticate, userCtrl.getUsers);
router.get("/:id", authenticate, userCtrl.getUser);
router.patch("/:id", authenticate, userCtrl.updateUser);
router.post(
  "/:id/avatar",
  authenticate,
  upload.single("avatar"),
  userCtrl.uploadAvatar
);

export default router;
