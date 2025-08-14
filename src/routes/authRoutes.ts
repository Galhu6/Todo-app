import { Router } from "express";
import {
  signIn,
  signUp,
  googleLogin,
  checkEmailAvailability,
  refreshToken,
  logout,
} from "../controllers/authController";

const router = Router();

router.post("/login", signIn);
router.post("/signup", signUp);
router.post("/google", googleLogin);
router.get("/check-email", checkEmailAvailability);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
