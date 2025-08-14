import { verifyGoogleToken } from "../components/Auth/GoogleLogin/googleVerify";
import {
  loginUser,
  registerUser,
  checkEmailInDB,
  refreshAuthToken,
} from "../services/Auth/authService";
import { HttpError } from "../middlewares/errorHandler";
import type { Request, Response, RequestHandler, NextFunction } from "express";

export const signUp: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    next(new HttpError(400, "name/email/password missing"));
    return;
  }

  try {
    const signup = await registerUser(email, password, name);
    if (!signup) {
      next(new HttpError(500, "register failed"));
      return;
    }
    const accessTtlMs = 30 * 60 * 1000; // 30 m
    const refreshTtlMs = 30 * 24 * 60 * 60 * 1000; // 30 d
    res
      .cookie("access", signup.token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: accessTtlMs,
      })
      .cookie("refresh", signup.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: refreshTtlMs,
      })
      .status(201)
      .json({
        success: true,
        message: "user registered successfully",
        user: signup.user,
      });
  } catch (err: any) {
    if (err.message === "User already exists") {
      next(new HttpError(400, err.message));
      return;
    }
    next(err);
  }
};

export const signIn: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new HttpError(400, "missing email/password"));
    return;
  }
  try {
    const login = await loginUser(email, password);
    const accessTtlMs = 30 * 60 * 1000; // 30 m
    const refreshTtlMs = 30 * 24 * 60 * 60 * 1000; // 30 d
    res
      .cookie("access", login.token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: accessTtlMs,
      })
      .cookie("refresh", login.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: refreshTtlMs,
      })
      .status(201)
      .json({
        success: true,
        user: login.user,
      });
  } catch (err: any) {
    if (err.message === "incorrect password") {
      next(new HttpError(400, "incorrect password"));
      return;
    }
    next(err);
  }
};

export const googleLogin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;
    const userData = await verifyGoogleToken(token);

    res.json({ success: true, user: userData });
  } catch (error) {
    next(new HttpError(401, "Invalid token, err: ", error));
  }
};

export const checkEmailAvailability: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.query;
  if (!email) {
    next(new HttpError(400, "Email is required"));
    return;
  }
  try {
    const exists = await checkEmailInDB(String(email));
    res.status(200).json({ exists });
  } catch (err) {
    next(err);
  }
};

export const refreshToken: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refresh = req.cookies?.refresh;
  if (!refresh) {
    next(new HttpError(400, "refresh token missing"));
    return;
  }
  try {
    const refreshed = refreshAuthToken(refresh);
    const accessTtlMs = 30 * 60 * 1000; // 30 m
    const refreshTtlMs = 30 * 24 * 60 * 60 * 1000; // 30 d
    res
      .cookie("access", refreshed.token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: accessTtlMs,
      })
      .cookie("refresh", refreshed.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: refreshTtlMs,
      })
      .status(201)
      .json({
        success: true,
        user: refreshed.user,
      });
  } catch (err) {
    next(new HttpError(401, "invalid token", err));
  }
};

export const logout: RequestHandler = (_req: Request, res: Response) => {
  res
    .clearCookie("access", { httpOnly: true, secure: true, sameSite: "lax" })
    .clearCookie("refresh", { httpOnly: true, secure: true, sameSite: "lax" })
    .json({ success: true });
};
