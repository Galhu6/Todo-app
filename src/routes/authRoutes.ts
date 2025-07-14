import { Router } from "express";
import { signIn, signUp, googleLogin, checkEmailAvailability, refreshToken } from "../controllers/authController.js";

const router = Router();

router.post("/login", signIn);
router.post("/signup", signUp);
router.post("/google", googleLogin);
router.get("/check-email", checkEmailAvailability);
router.post("/refresh", refreshToken);

export default router;