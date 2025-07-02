import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

process.env.TZ = "UTC";

import authRoutes from "./routes/authRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js"
import { errorHandler } from "./middlewares/errorHandler.js";
dotenv.config();

const app = express();

app.use(morgan("dev"));

app.use(cors({
    origin: process.env.VITE_FRONTEND_URL,
    credentials: true
}));

app.use(express.json())

app.use("/api/auth", authRoutes);
app.use("/api/lists", listRoutes);
app.use("/api", taskRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/calendar", calendarRoutes)

app.use(errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});


export default app;
