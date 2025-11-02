import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import User from "../models/user";

export interface AuthRequest extends Request {
  user?: any;
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token =
      req.cookies?.access_token ||
      req.headers.authorization?.split(" ")[1] ||
      null;

    if (!token) return res.status(401).json({ message: "Missing token" });

    const payload = verifyAccessToken(token);
    const user = await User.findByPk(payload.sub);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = { id: user.id, name: user.name, email: user.email };
    next();
  } catch (err: any) {
    res.status(401).json({ message: "Invalid token" });
  }
}
