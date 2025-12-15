import express from "express";
import {
    createLesson,
    getAllLessons,
    getLessonById,
    updateLesson,
    deleteLesson
} from "../controllers/lessonController.js";

const router = express.Router();

// CREATE
router.post("/", createLesson);

// READ
router.get("/", getAllLessons);
router.get("/:id", getLessonById);

// UPDATE
router.put("/:id", updateLesson);

// DELETE
router.delete("/:id", deleteLesson);

export default router;
