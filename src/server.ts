import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import listRoutes from "./routes/listRoutes";
import taskRoutes from "./routes/taskRoutes";
dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // אפשר גם '*' בזמן פיתוח
    credentials: true // אם אתה משתמש ב-cookie או header עם credentials
}));

app.use(express.json())

app.use("/api/auth", authRoutes);
app.use("/api/lists", listRoutes);
app.use("/api", taskRoutes);

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

export default app;
