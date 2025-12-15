import express from "express";
import {
    saveLesson,
    getSavedLessons
} from "../controllers/savedlessonController.js";

const router = express.Router();

// CREATE
router.post("/", saveLesson);

// READ
router.get("/", getSavedLessons);


export default router;
