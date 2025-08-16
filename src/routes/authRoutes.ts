import { Router } from "express";
import rateLimit from "express-rate-limit";
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

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(authLimiter);

router.post("/login", signIn);
router.post("/signup", signUp);
router.post("/google/callback", googleLogin);
router.get("/check-email", checkEmailAvailability);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.patch("/whatsapp", authMiddleware, updateWhatsapp);

export default router;
