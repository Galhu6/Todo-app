import { Router } from "express";
import {
    createTask,
    editTask,
    completeTask,
    deleteTask,
    getTasks,
} from "../controllers/taskController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/:listId/tasks", getTasks);
router.post("/:listId/new-task", createTask);
router.put("/tasks/:taskId", editTask);
router.patch("/tasks/:taskId/complete", completeTask);
router.delete("/tasks/:taskId", deleteTask);

export default router;
