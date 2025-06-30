import type { Request, Response, NextFunction } from "express";

export class HttpError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    const status = typeof err.status === "number" ? err.status : 500;
    const message = err.message || "internal server error";
    res.status(status.json({ success: false, error: message }));
};