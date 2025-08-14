import { Router } from "express";
import { chatWithAi, getChatHistory } from "../controllers/aiChatController";
import { authMiddleware } from "../middlewares/authMiddleware";
const router = Router();

router.use(authMiddleware);
router.get("/chat", getChatHistory);
router.post("/chat", chatWithAi);
export default router;
