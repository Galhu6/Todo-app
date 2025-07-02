import { Router } from "express";
import { addEvent } from "../controllers/calendarController.js";

const router = Router();

router.post("/event", addEvent);

export default router;