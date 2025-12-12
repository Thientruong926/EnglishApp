// Exercise.js
const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema({
    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    question: { type: String, required: true },
    type: { type: String, enum: ["multiple-choice", "fill-in", "listening", "match"], required: true },
    options: { type: [String] },
    correct_answer: { type: mongoose.Schema.Types.Mixed, required: true },
});

module.exports = mongoose.model("Exercise", ExerciseSchema);