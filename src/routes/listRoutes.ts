import { Router } from "express";
import {
  createListController,
  editListController,
  deleteListController,
  getListController,
  getAllListsController,
  getDeletedListController,
  getSubListsController,
} from "../controllers/listController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { verifyListOwnership } from "../middlewares/verifyOwnerships";
const router = Router();

router.use(authMiddleware);

router.get("/", getAllListsController);
router.get("/trash", getDeletedListController);
router.get("/:listId", verifyListOwnership, getListController);
router.post("/new-list", createListController);
router.get("/:listId/sub-lists", verifyListOwnership, getSubListsController);
router.patch("/:listId", verifyListOwnership, editListController);
router.delete("/:listId", verifyListOwnership, deleteListController);

export default router;
