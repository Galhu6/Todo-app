import { Router } from "express";
import {
    createTaskController,
    editTaskController,
    completeTaskController,
    deleteTaskController,
    getAllTasksController,
    getTasksController,
} from "../controllers/taskController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { verifyTaskOwnership } from "../middlewares/verifyOwnerships";

const router = Router();

router.use(authMiddleware);

router.get("/lists/:listId/tasks/", getAllTasksController);
router.get("/lists/:listId/tasks/:taskId", getTasksController);
router.post("/lists/:listId/new-task", createTaskController);
router.patch("/lists/:listId/tasks/:taskId", verifyTaskOwnership, editTaskController);
router.post("/lists/:listId/tasks/:taskId/complete", verifyTaskOwnership, completeTaskController);
router.delete("/lists/:listId/tasks/:taskId", verifyTaskOwnership, deleteTaskController);

export default router;
