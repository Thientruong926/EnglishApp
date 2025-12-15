// routes/exerciseRoute.js
import express from "express";
import {
    createExercise,
    getAllExercises,
    getExerciseById,
    getExercisesByLessonId,
    updateExercise,
    deleteExercise
} from "../controllers/exerciseController.js";

const router = express.Router();

// CREATE
router.post("/", createExercise);

// READ
router.get("/", getAllExercises);
router.get("/:id", getExerciseById);
router.get("/lesson/:lesson_id", getExercisesByLessonId);

// UPDATE
router.put("/:id", updateExercise);

// DELETE
router.delete("/:id", deleteExercise);

export default router;
