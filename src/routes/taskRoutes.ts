import { Router } from "express";
import {
  createTaskController,
  editTaskController,
  completeTaskController,
  deleteTaskController,
  getAllTasksController,
  getTasksController,
  duplicateTaskController,
  setTaskPendingController,
  getDeletedTasksController,
  addTaskToListController,
  removeTaskFromListController,
} from "../controllers/taskController";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  verifyListOwnership,
  verifyTaskOwnership,
  verifyTargetListOwnership,
} from "../middlewares/verifyOwnerships";
import { validate } from "../middlewares/validate";
import { createTaskSchema } from "../schemas/taskSchemas";

const router = Router();

router.use(authMiddleware);

router.get("/lists/:listId/tasks/", verifyListOwnership, getAllTasksController);
router.get(
  "/lists/:listId/tasks/trash",
  verifyListOwnership,
  getDeletedTasksController
);
router.get(
  "/lists/:listId/tasks/:taskId",
  verifyListOwnership,
  getTasksController
);
router.post(
  "/lists/:listId/tasks",
  verifyListOwnership,
  validate(createTaskSchema),
  createTaskController
);
router.patch(
  "/lists/:listId/tasks/:taskId",
  verifyTaskOwnership,
  editTaskController
);
router.post(
  "/lists/:listId/tasks/:taskId/complete",
  verifyTaskOwnership,
  completeTaskController
);
router.post(
  "/lists/:listId/tasks/:taskId/set-pending",
  verifyTaskOwnership,
  setTaskPendingController
);
router.post(
  "/lists/:listId/tasks/:taskId/duplicate",
  verifyTaskOwnership,
  duplicateTaskController
);
router.post(
  "/lists/:listId/tasks/:taskId/share/:targetListId",
  verifyTaskOwnership,
  verifyTargetListOwnership,
  addTaskToListController
);
router.delete(
  "/lists/:listId/tasks/:taskId/share/:targetListId",
  verifyTaskOwnership,
  verifyTargetListOwnership,
  removeTaskFromListController
);
router.delete(
  "/lists/:listId/tasks/:taskId",
  verifyTaskOwnership,
  deleteTaskController
);

export default router;
