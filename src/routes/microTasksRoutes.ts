import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { verifyTaskOwnership, verifyMicroTaskOwnership } from "../middlewares/verifyOwnerships.js";
import { createMicroTaskController, deleteMicroTaskController, getMicroTaskController, updateMicroTaskController } from "../controllers/microTaskController.js";

const router = Router();
router.use(authMiddleware);

router.get('/tasks/:taskId/microtasks', verifyTaskOwnership, getMicroTaskController);
router.post('/tasks/:taskId/microtasks', verifyTaskOwnership, createMicroTaskController);
router.patch("/microTasks/:microTaskId", verifyMicroTaskOwnership, updateMicroTaskController);
router.delete('/microtasks/:microTaskId', verifyMicroTaskOwnership, deleteMicroTaskController);

export default router;