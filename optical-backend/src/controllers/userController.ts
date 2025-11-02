import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import {
  createUserSchema,
  updateUserSchema,
} from "../validators/userValidators";
import path from "path";

export async function createUser(req: Request, res: Response) {
  try {
    const data = createUserSchema.parse(req.body);
    const hash = await bcrypt.hash(data.password, 10);
    const user = await User.create({ ...data, password_hash: hash });
    res.status(201).json({ id: user.id, name: user.name, phone: user.phone });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    res.status(400).json({ message: "Unknown error occurred" });
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password_hash"] },
    });
    res.json(users);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Unknown error occurred" });
    }
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password_hash"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Unknown error occurred" });
    }
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const data = updateUserSchema.parse(req.body);
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.update(data);
    res.json({ ok: true });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: "Unknown error occurred" });
    }
  }
}

/**
 * Upload a user avatar
 */
export async function uploadAvatar(
  req: Request & { file?: Express.Multer.File },
  res: Response
) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optional: Save image path (relative) to user record
    const filePath = path.relative(process.cwd(), req.file.path);
    (user as any).avatar_url = filePath;
    await user.save();

    res.json({
      message: "Avatar uploaded successfully",
      filePath,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Unknown error occurred" });
    }
  }
}
