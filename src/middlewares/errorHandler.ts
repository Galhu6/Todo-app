import type { Request, Response, NextFunction } from "express";

export class HttpError extends Error {
    status: number;
    cause?: unknown;
    constructor(status: number, message: string, cause?: unknown) {
        super(message);
        this.status = status;
        this.cause = cause;
    }
}

export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    const status = typeof err.status === "number" ? err.status : typeof err.statusCode === "number"
        ? err.statusCode
        : 500;
    const message = status >= 500 ? "internal server error" : err.message || "error";

    if (process.env.NODE_ENV !== "test") {
        console.error(err);
    }
    res.status(status).json({ success: false, error: message });
};