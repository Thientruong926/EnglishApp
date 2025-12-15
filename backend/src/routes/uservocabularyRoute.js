import express from "express";
import {
    addVocabularyToUser,
    getUserVocabularies,
    markVocabularyLearned,
    deleteUserVocabulary
} from "../controllers/uservocabularyController.js";

const router = express.Router();

// CREATE
router.post("/", addVocabularyToUser);

// READ
router.get("/", getUserVocabularies);

// UPDATE
router.patch("/:id", markVocabularyLearned);

// DELETE
router.delete("/:id", deleteUserVocabulary);

export default router;
