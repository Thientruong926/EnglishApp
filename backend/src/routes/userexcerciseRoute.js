import express from "express";
import {
     submitExercise,
    getUserExerciseResults
} from "../controllers/userexcerciseController.js";

const router = express.Router();

// CREATE
router.post("/", submitExercise);

// READ
router.get("/", getUserExerciseResults);


export default router;
