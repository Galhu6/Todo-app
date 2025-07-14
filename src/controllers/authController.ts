import { verifyGoogleToken } from "../components/Auth/GoogleLogin/googleVerify.js";
import { loginUser, registerUser, checkEmailInDB, refreshAuthToken } from "../services/Auth/authService.js";
import { HttpError } from "../middlewares/errorHandler.js"
import type { Request, Response, RequestHandler, NextFunction } from "express";

export const signUp: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        next(new HttpError(400, "name/email/password missing"))
        return;
    };

    try {
        const signup = await registerUser(email, password, name);
        if (!signup) {
            next(new HttpError(500, "register failed"))
            return;
        }
        res.status(201).json({ success: true, message: "user registerd successfully", token: signup.token, refreshToken: signup.refreshToken, user: signup.user });
    } catch (err: any) {
        if (err.message === "User already exists") {
            next(new HttpError(400, err.message)); ``
            return;
        }
        next(err)
    }
};

export const signIn: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
        next(new HttpError(400, "missing email/password"));
        return;
    }
    try {
        const login = await loginUser(email, password);
        res.status(200).json({ success: true, token: login.token, refreshToken: login.refreshToken, user: login.user });
    } catch (err: any) {
        if (err.message === "incorrect password") {
            next(new HttpError(400, "incorrect password"));
            return;
        }
        next(err);
    }
};

export const googleLogin: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;
        const userData = await verifyGoogleToken(token);

        res.json({ success: true, user: userData });
    } catch (error) {
        next(new HttpError(401, "Invalid token"));
    }
};

export const checkEmailAvailability: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {

    const { email } = req.query
    if (!email) {
        next(new HttpError(400, "Email is required"));
        return;
    };
    try {
        const exists = await checkEmailInDB(String(email));
        res.status(200).json({ exists })
    } catch (err) {
        next(err);

    }

};

export const refreshToken: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        next(new HttpError(400, "refresh token missing"));
        return;
    }
    try {
        const refreshed = refreshAuthToken(refreshToken);
        res.status(200).json({ success: true, ...refreshed });
    } catch (err) {
        next(new HttpError(401, "invalid token"));
    }
};