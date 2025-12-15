// controllers/lesson.controller.js
import Lesson from "../models/Lesson.js";

export const createLesson = async (req, res) => {
    try {
        const { title, content, topic, image_url } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Thiếu title hoặc content" });
        }

        const lesson = await Lesson.create({
            title,
            content,
            topic,
            image_url
        });

        return res.status(201).json({
            message: "Tạo lesson thành công",
            lesson
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

export const getAllLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find();
        return res.status(200).json(lessons);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getLessonById = async (req, res) => {
    try {
        const { id } = req.params;

        const lesson = await Lesson.findById(id);
        if (!lesson) {
            return res.status(404).json({ message: "Không tìm thấy lesson" });
        }

        return res.status(200).json(lesson);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const updateLesson = async (req, res) => {
    try {
        const { id } = req.params;

        const lesson = await Lesson.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!lesson) {
            return res.status(404).json({ message: "Không tìm thấy lesson" });
        }

        return res.status(200).json({
            message: "Cập nhật thành công",
            lesson
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;

        const lesson = await Lesson.findByIdAndDelete(id);
        if (!lesson) {
            return res.status(404).json({ message: "Không tìm thấy lesson" });
        }

        return res.status(200).json({ message: "Xóa lesson thành công" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
