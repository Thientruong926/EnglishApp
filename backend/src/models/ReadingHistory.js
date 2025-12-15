import mongoose from "mongoose";

const ReadingHistorySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    started_at: { type: Date, default: Date.now },
    finished_at: { type: Date }
});

const ReadingHistory=  mongoose.model("ReadingHistory", ReadingHistorySchema);
export default ReadingHistory;