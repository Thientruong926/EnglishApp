// SavedLesson.js
const mongoose = require("mongoose");

const SavedLessonSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    saved_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Saved_Lesson", SavedLessonSchema);