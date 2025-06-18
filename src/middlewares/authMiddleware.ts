import type { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader?.includes("Bearer")) {
        res.status(401).json({ success: false, error: "Unauthorized" });
    } else {

        try {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            (req as any).user = decoded;
            next();
        } catch (err) {
            res.status(403).json({ success: false, error: "forbidden" })

        }
    }
}