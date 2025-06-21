import { Router } from "express";
import { signIn, signUp, googleLogin } from "../controllers/authController";

const router = Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/google-login", googleLogin);

export default router