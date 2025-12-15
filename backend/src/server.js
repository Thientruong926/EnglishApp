import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";

import authRoute from "./routes/authRoute.js";
import lessonRoute from "./routes/lessonRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/lessons", lessonRoute);

// Start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server bắt đầu tại cổng ${PORT}`);
    });
});
