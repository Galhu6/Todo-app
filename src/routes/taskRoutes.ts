import { Router } from "express";
import {
    createTaskController,
    editTaskController,
    completeTaskController,
    deleteTaskController,
    getTasksController,
} from "../controllers/taskController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { verifyTaskOwnership } from "../middlewares/verifyOwnerships";

const router = Router();

router.use(authMiddleware);

router.get("/lists/:listId/tasks", getTasksController);
router.post("/lists/:listId/new-task", createTaskController);
router.patch("/lists/:listId/tasks/:taskId", verifyTaskOwnership, editTaskController);
router.post("/lists/:listId/tasks/:taskId/complete", verifyTaskOwnership, completeTaskController);
router.delete("/lists/:listIds/tasks/:taskId", verifyTaskOwnership, deleteTaskController);

export default router;
