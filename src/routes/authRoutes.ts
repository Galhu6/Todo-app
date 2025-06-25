import { Router } from "express";
import { signIn, signUp, googleLogin, checkEmailAvailability } from "../controllers/authController.js";

const router = Router();

router.post("/login", signIn);
router.post("/signup", signUp);
router.post("/google", googleLogin);
router.get("/check-email", checkEmailAvailability)

export default router;