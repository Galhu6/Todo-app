import { Router } from "express";
import { signIn, signUp, googleLogin, checkEmailAvailability } from "../controllers/authController";

const router = Router();

router.post("/login", signIn);
router.post("/signup", signUp);
router.post("/google", googleLogin);
router.post("/check-email", checkEmailAvailability)

export default router;