import { Router } from "express";
import { chatWithAi } from "../controllers/aiChatController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = Router();

router.use(authMiddleware);
router.post("/chat", chatWithAi);
export default router;