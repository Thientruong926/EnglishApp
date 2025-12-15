// routes/lessonVocabularyRoute.js
import express from "express";
import {
    createLessonVocabulary,
    getAllLessonVocabularies,
    getLessonVocabularyById,
    getVocabulariesByLessonId,
    updateLessonVocabulary,
    deleteLessonVocabulary
} from "../controllers/lessonVocabularyController.js";

const router = express.Router();

// CREATE
router.post("/", createLessonVocabulary);

// READ
router.get("/", getAllLessonVocabularies);
router.get("/:id", getLessonVocabularyById);
router.get("/lesson/:lesson_id", getVocabulariesByLessonId);

// UPDATE
router.put("/:id", updateLessonVocabulary);

// DELETE
router.delete("/:id", deleteLessonVocabulary);

export default router;
