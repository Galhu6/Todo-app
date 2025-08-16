import { Router } from "express";
import {
  signIn,
  signUp,
  googleLogin,
  checkEmailAvailability,
  refreshToken,
  logout,
  updateWhatsapp,
} from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/login", signIn);
router.post("/signup", signUp);
router.post("/google", googleLogin);
router.get("/check-email", checkEmailAvailability);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.patch("/whatsapp", authMiddleware, updateWhatsapp);

export default router;
