import { Router } from "express";
import { chatWithAi, getChatHistory } from "../controllers/aiChatController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = Router();

router.use(authMiddleware);
router.get("/chat", getChatHistory);
router.post("/chat", chatWithAi);
export default router;