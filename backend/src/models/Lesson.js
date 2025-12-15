// Lesson.js
import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    topic: { type: String },
    image_url: {type:String}
}, { timestamps: true });

const Lesson =  mongoose.model("Lesson", LessonSchema);
export default Lesson