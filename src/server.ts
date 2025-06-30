import express from "express";
import cors from "cors";
import dotenv from "dotenv";

process.env.TZ = "UTC";

import authRoutes from "./routes/authRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.VITE_FRONTEND_URL, // אפשר גם '*' בזמן פיתוח
    credentials: true // אם אתה משתמש ב-cookie או header עם credentials
}));

app.use(express.json())

app.use("/api/auth", authRoutes);
app.use("/api/lists", listRoutes);
app.use("/api", taskRoutes);

app.use(errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});


export default app;
