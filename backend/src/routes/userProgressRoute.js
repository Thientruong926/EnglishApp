// routes/userProgressRoute.js
import express from "express";
import {
    createUserProgress,
    getAllUserProgresses,
    getUserProgressById,
    getUserProgressesByUserId,
    getProgressByUserAndLesson,
    updateUserProgress,
    deleteUserProgress
} from "../controllers/userProgressController.js";

const router = express.Router();

// CREATE
router.post("/", createUserProgress);

// READ
router.get("/", getAllUserProgresses);
router.get("/:id", getUserProgressById);
router.get("/user/:user_id", getUserProgressesByUserId);
router.get("/user/:user_id/lesson/:lesson_id", getProgressByUserAndLesson);

// UPDATE
router.put("/:id", updateUserProgress);

// DELETE
router.delete("/:id", deleteUserProgress);

export default router;
