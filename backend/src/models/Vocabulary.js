// Vocabulary.js
const mongoose = require("mongoose");

const VocabularySchema = new mongoose.Schema({
    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    word: { type: String, required: true },
    meaning: { type: String, required: true },
    ex_sentence: { type: String }
});

module.exports = mongoose.model("Vocabulary", VocabularySchema);