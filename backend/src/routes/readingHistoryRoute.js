// routes/readingHistoryRoute.js
import express from "express";
import {
    createReadingHistory,
    getAllReadingHistories,
    getReadingHistoryById,
    getReadingHistoriesByUserId,
    getReadingHistoriesByLessonId,
    updateReadingHistory,
    deleteReadingHistory
} from "../controllers/readingHistoryController.js";

const router = express.Router();

// CREATE
router.post("/", createReadingHistory);

// READ
router.get("/", getAllReadingHistories);
router.get("/:id", getReadingHistoryById);
router.get("/user/:user_id", getReadingHistoriesByUserId);
router.get("/lesson/:lesson_id", getReadingHistoriesByLessonId);

// UPDATE
router.put("/:id", updateReadingHistory);

// DELETE
router.delete("/:id", deleteReadingHistory);

export default router;
