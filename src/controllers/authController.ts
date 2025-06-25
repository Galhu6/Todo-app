import { verifyGoogleToken } from "../components/Auth/GoogleLogin/googleVerify.js";
import { loginUser, registerUser, checkEmailInDB } from "../services/Auth/authService.js";
import type { Request, Response, RequestHandler } from "express";

export const signUp: RequestHandler = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        res.status(400).json({ error: "name/email/password missing" });
        return;
    };



    try {
        const signup = await registerUser(email, password, name);
        if (!signup) {
            res.status(500).json({ success: false, error: "registration failed" });
            return;
        }
        res.status(201).json({ success: true, message: "user registerd successfully", token: signup.token, user: signup.user });
    } catch (err: any) {
        console.error("Signup failed", err);
        if (err.message === "User already exists") {
            res.status(400).json({ success: false, error: err.message });
            return;
        }
        res.status(500).json({ success: false, error: "failed to register" });
    }
};

export const signIn: RequestHandler = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ success: false, error: "missing email/password" });
        return;

    }
    try {
        const login = await loginUser(email, password);
        res.status(200).json({ success: true, token: login.token, user: login.user });
    } catch (err: any) {
        if (err.message === "incorrect password") {
            res.status(400).json({ success: false, error: "incorrect password" });
            return;
        }
        res.status(500).json({ success: false, error: "server failed to login" });
    }
};

export const googleLogin: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        const userData = await verifyGoogleToken(token);

        res.json({ success: true, user: userData });
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export const checkEmailAvailability: RequestHandler = async (req: Request, res: Response) => {

    const { email } = req.query
    if (!email) {
        res.status(400).json({ success: false, error: "Email is required" })
        return;
    };

    const exists = await checkEmailInDB(String(email));
    res.status(200).json({ exists })

};