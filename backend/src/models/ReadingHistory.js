// ReadingHistory.js
const mongoose = require("mongoose");

const ReadingHistorySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    started_at: { type: Date, default: Date.now },
    finished_at: { type: Date }
});

module.exports = mongoose.model("Reading_History", ReadingHistorySchema);