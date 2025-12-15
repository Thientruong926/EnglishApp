import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";

import authRoute from "./routes/authRoute.js";
import lessonRoute from "./routes/lessonRoute.js";
import vocabularyRoute from "./routes/vocabularyRoute.js";
import exerciseRoute from "./routes/exerciseRoute.js";
import savedlessonRoute from "./routes/savedlessonRoute.js";
import userexcerciseRoute from "./routes/userexerciseRoute.js";
import userfolderRoute from "./routes/userfolderRoute.js";
import uservocabularyRoute from "./routes/uservocabularyRoute.js";
import lessonVocabularyRoute from "./routes/lessonVocabularyRoute.js";
import readingHistoryRoute from "./routes/readingHistoryRoute.js";
import userProgressRoute from "./routes/userProgressRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/lessons", lessonRoute);
app.use("/api/vocabularies", vocabularyRoute);
app.use("/api/exercises", exerciseRoute);
app.use("/api/saved-lessons", savedlessonRoute);
app.use("/api/user-exercises", userexcerciseRoute);
app.use("/api/user-folders", userfolderRoute);
app.use("/api/user-vocabularies", uservocabularyRoute);
app.use("/api/lesson-vocabularies", lessonVocabularyRoute);
app.use("/api/reading-histories", readingHistoryRoute);
app.use("/api/user-progresses", userProgressRoute);

// Start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server bắt đầu tại cổng ${PORT}`);
    });
});
