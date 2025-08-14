import { Router } from "express";
import { addEvent } from "../controllers/calendarController";

const router = Router();

router.post("/event", addEvent);

export default router;
