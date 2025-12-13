// UserProgress.js
import mongoose from "mongoose";

const UserProgressSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    status: { type: String, enum: ["not_started", "in_progress", "completed"], default: "not_started" },
    last_accessed: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User_Progress", UserProgressSchema);