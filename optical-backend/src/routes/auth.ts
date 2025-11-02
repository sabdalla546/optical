import { Router } from "express";
import * as authController from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { handleUploadError } from "../middleware/upload";

const router = Router();

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", authController.register);

/**
 * @route POST /api/v1/auth/login
 * @desc Login user and receive access & refresh tokens
 * @access Public
 */
router.post("/login", authController.login);

/**
 * @route POST /api/v1/auth/refresh
 * @desc Get a new access token using refresh token
 * @access Public
 */
router.post("/refresh", authController.refresh);

/**
 * @route POST /api/v1/auth/logout
 * @desc Revoke refresh token (logout user)
 * @access Public (token handled manually)
 */
router.post("/logout", authController.logout);

/**
 * @route GET /api/v1/auth/me
 * @desc Get current authenticated user info
 * @access Private
 */
router.get("/me", authenticate, async (req: any, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route POST /api/v1/auth/upload-avatar
 * @desc Example of using multer upload middleware (if user wants to upload via auth)
 * @access Private
 */
router.post("/upload-avatar", authenticate);

router.post("/rotate", authController.rotate);

export default router;
