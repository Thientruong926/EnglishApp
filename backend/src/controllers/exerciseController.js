// controllers/exerciseController.js
import Exercise from "../models/Exercise.js";
import Lesson from "../models/Lesson.js";
import mongoose from "mongoose";

export const createExercise = async (req, res) => {
    try {
        const { lesson_id, question, type, options, correct_answer } = req.body;

        if (!lesson_id || !question || !type || !correct_answer) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
        }

        const lessonExists = await Lesson.exists({ _id: lesson_id });
        if (!lessonExists) {
            return res.status(404).json({ message: "Lesson không tồn tại" });
        }

        const exercise = await Exercise.create({
            lesson_id,
            question,
            type,
            options,
            correct_answer
        });

        return res.status(201).json({ message: "Thêm bài tập thành công", exercise });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getAllExercises = async (req, res) => {
    try {
        const exercises = await Exercise.find();
        return res.status(200).json(exercises);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getExerciseById = async (req, res) => {
    try {
        const { id } = req.params;

        const exercise = await Exercise.findById(id);
        if (!exercise) {
            return res.status(404).json({ message: "Không tìm thấy bài tập" });
        }

        return res.status(200).json(exercise);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getExercisesByLessonId = async (req, res) => {
    try {
        const { lesson_id } = req.params;

        const exercises = await Exercise.find({ lesson_id: lesson_id });
        return res.status(200).json(exercises);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const updateExercise = async (req, res) => {
    try {
        const { id } = req.params;
        const { lesson_id, question, type, options, correct_answer } = req.body;

        const exercise = await Exercise.findByIdAndUpdate(
            id,
            { lesson_id, question, type, options, correct_answer },
            { new: true }
        );

        if (!exercise) {
            return res.status(404).json({ message: "Không tìm thấy bài tập" });
        }

        return res.status(200).json({ message: "Cập nhật bài tập thành công", exercise });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const deleteExercise = async (req, res) => {
    try {
        const { id } = req.params;

        const exercise = await Exercise.findByIdAndDelete(id);
        if (!exercise) {
            return res.status(404).json({ message: "Không tìm thấy bài tập" });
        }

        return res.status(200).json({ message: "Xóa bài tập thành công" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
