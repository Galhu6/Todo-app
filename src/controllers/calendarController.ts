import type { RequestHandler, Request, Response, NextFunction } from "express";
import { creatCalendarEvent } from "../services/Calendar/calendarService";
import { HttpError } from "../middlewares/errorHandler";

export const addEvent: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessToken, summary, description, startTime, endTime } = req.body;
  if (!accessToken || !summary || !startTime || !endTime) {
    next(
      new HttpError(
        400,
        "accessToken, summary, start and end time are required"
      )
    );
    return;
  }

  try {
    const event = await creatCalendarEvent(accessToken, {
      summary,
      description,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
    });
    res.status(201).json({ success: true, event });
  } catch (err) {
    next(err);
  }
};
