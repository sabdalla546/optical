import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}${ext}`;
    cb(null, name);
  },
});

export const upload = multer({ storage });

// Optional helper to handle upload errors gracefully
export function handleUploadError(err: any, req: any, res: any, next: any) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
}
