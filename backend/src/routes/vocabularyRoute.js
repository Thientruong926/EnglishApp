import express from "express";
import {
    createVocabulary,
    getAllVocabulary,
    getVocabularyById
} from "../controllers/vocabularyController.js";


const router = express.Router();

// CREATE
router.post("/", createVocabulary);

// READ
router.get("/", getAllVocabulary);
router.get("/:id", getVocabularyById);

//UPDATE
router.put("/:id", updateVocabulary);

// DELETE
router.delete("/:id", deleteVocabulary);

export default router;
