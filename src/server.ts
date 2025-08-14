import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";

process.env.TZ = "UTC";

import authRoutes from "./routes/authRoutes.ts";
import listRoutes from "./routes/listRoutes.ts";
import taskRoutes from "./routes/taskRoutes.ts";
import microTaskRoutes from "./routes/microTasksRoutes.ts";
import aiRoutes from "./routes/aiRoutes.ts";
import calendarRoutes from "./routes/calendarRoutes.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import { logger } from "./logger.ts";
dotenv.config();

const app = express();
export { app };

app.use(morgan("dev"));

app.use(helmet());

app.use(
  cors({
    origin: [process.env.VITE_FRONTEND_URL ?? "http://localhost:5173"],
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(cookieParser());

app.use(express.json());

app.get("/health", (_req, res) => {
  res.sendStatus(200);
});

app.use("/api/auth", authRoutes);
app.use("/api/lists", listRoutes);
app.use("/api", taskRoutes);
app.use("/api", microTaskRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/calendar", calendarRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
  });
}

export default app;
