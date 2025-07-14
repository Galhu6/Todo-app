import type { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { HttpError } from "./errorHandler.js";

dotenv.config();

export const authMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.includes("Bearer")) {
        next(new HttpError(401, "Unauthorized"));
        return;
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
        const headerId = req.headers["x-user-id"];
        const userIdFromHeader = typeof headerId === "string" ? parseInt(headerId, 10) : undefined;
        (req as any).user = { ...decoded, id: (decoded as any).id ?? userIdFromHeader, };
        next();
    } catch (err) {
        next(new HttpError(403, 'forbidden', err))
    }

};