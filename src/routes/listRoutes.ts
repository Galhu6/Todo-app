import { Router } from "express";
import {
    createListController,
    editListController,
    deleteListController,
    getListController,
    getAllListsController,
    getDeletedListController
} from "../controllers/listController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { verifyListOwnership } from "../middlewares/verifyOwnerships.js";
const router = Router();

router.use(authMiddleware);

router.get("/", getAllListsController);
router.get('/trash', getDeletedListController)
router.get("/:listId", verifyListOwnership, getListController);
router.post("/new-list", createListController);
router.patch("/:listId", verifyListOwnership, editListController);
router.delete("/:listId", verifyListOwnership, deleteListController);

export default router;
