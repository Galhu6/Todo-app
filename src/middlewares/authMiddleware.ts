import type { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { HttpError } from "./errorHandler";

dotenv.config();

export const authMiddleware: RequestHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.access;
  const headerId = req.headers["x-user-id"];
  const isProd = process.env.NODE_ENV === "production";

  if (!token) {
    if (!isProd && headerId) {
      (req as any).user = { id: parseInt(headerId as string, 10) };
      next();
      return;
    }
    next(new HttpError(401, "Unauthorized"));
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;
    const userIdFromHeader =
      typeof headerId === "string" ? parseInt(headerId, 10) : undefined;
    (req as any).user = {
      ...decoded,
      id: (decoded as any).id ?? userIdFromHeader,
    };
    next();
  } catch (err) {
    next(new HttpError(401, "Unauthorized", err));
  }
};
