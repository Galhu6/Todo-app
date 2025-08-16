import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";

process.env.TZ = "UTC";

import authRoutes from "./routes/authRoutes";
import listRoutes from "./routes/listRoutes";
import taskRoutes from "./routes/taskRoutes";
import microTaskRoutes from "./routes/microTasksRoutes";
import aiRoutes from "./routes/aiRoutes";
import calendarRoutes from "./routes/calendarRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { logger } from "./logger";
dotenv.config();

const app = express();
export { app };

app.use(morgan("dev"));

app.use(helmet());

const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
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
