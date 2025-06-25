import { Router } from "express";
import {
    createListController,
    editListController,
    deleteListController,
    getListController,
    getAllListsController,
} from "../controllers/listController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getAllListsController);
router.get("/:listId", getListController);
router.post("/new-list", createListController);
router.patch("/:listId", editListController);
router.delete("/:listId", deleteListController);

export default router;
