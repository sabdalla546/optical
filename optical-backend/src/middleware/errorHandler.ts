import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("[ERROR]", err);

  if (err.name === "ZodError") {
    return res.status(422).json({
      message: "Validation failed",
      errors: err.errors,
    });
  }

  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
