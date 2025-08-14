import type { Request, Response, NextFunction } from "express";
import { logger } from "../logger";

export class HttpError extends Error {
  status: number;
  cause?: unknown;
  code?: string;
  constructor(status: number, message: string, cause?: unknown, code?: string) {
    super(message);
    this.status = status;
    this.cause = cause;
    this.code = code;
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  const status = err.status ?? 500;
  const code = err.code ?? "INTERNAL_ERROR";

  if (status >= 500) {
    logger.error(
      {
        code,
        message: err.message,
        stack: err.stack,
        path: req.path,
      },
      "[SERVER_ERROR]"
    );
  }
  res.status(status).json({
    error: code,
    message: status >= 500 ? "internal server error" : err.message,
  });
};
