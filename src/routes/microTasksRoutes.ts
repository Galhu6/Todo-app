import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  verifyTaskOwnership,
  verifyMicroTaskOwnership,
} from "../middlewares/verifyOwnerships";
import {
  createMicroTaskController,
  deleteMicroTaskController,
  getMicroTaskController,
  updateMicroTaskController,
} from "../controllers/microTaskController";

const router = Router();
router.use(authMiddleware);

router.get(
  "/tasks/:taskId/microtasks",
  verifyTaskOwnership,
  getMicroTaskController
);
router.post(
  "/tasks/:taskId/microtasks",
  verifyTaskOwnership,
  createMicroTaskController
);
router.patch(
  "/microTasks/:microTaskId",
  verifyMicroTaskOwnership,
  updateMicroTaskController
);
router.delete(
  "/microTasks/:microTaskId",
  verifyMicroTaskOwnership,
  deleteMicroTaskController
);

export default router;
