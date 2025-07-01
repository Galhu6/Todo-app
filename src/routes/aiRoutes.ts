import { Router } from "express";
import { chatWithAi } from "../controllers/aiChatController";
import { authMiddleware } from "../middlewares/authMiddleware";
const router = Router();

router.use(authMiddleware);
router.post("/chat", chatWithAi);
export default router;