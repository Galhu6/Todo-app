import { Router } from "express";
import {
    createTaskController,
    editTaskController,
    completeTaskController,
    deleteTaskController,
    getAllTasksController,
    getTasksController,
} from "../controllers/taskController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { verifyListOwnership, verifyTaskOwnership } from "../middlewares/verifyOwnerships.js";

const router = Router();

router.use(authMiddleware);

router.get("/lists/:listId/tasks/", verifyListOwnership, getAllTasksController);
router.get("/lists/:listId/tasks/:taskId", verifyListOwnership, getTasksController);
router.post("/lists/:listId/new-task", verifyListOwnership, createTaskController);
router.patch("/lists/:listId/tasks/:taskId", verifyTaskOwnership, editTaskController);
router.post("/lists/:listId/tasks/:taskId/complete", verifyTaskOwnership, completeTaskController);
router.delete("/lists/:listId/tasks/:taskId", verifyTaskOwnership, deleteTaskController);

export default router;
