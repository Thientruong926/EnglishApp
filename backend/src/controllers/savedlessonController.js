// controllers/savedLesson.controller.js
import SavedLesson from "../models/SavedLesson.js";

export const saveLesson = async (req, res) => {
    try {
    const { user_id, lesson_id } = req.body;

    if (!user_id || !lesson_id) {
      return res.status(400).json({ message: "Thiếu user_id hoặc lesson_id" });
    }

    const saved = await SavedLesson.create({
      user_id,
      lesson_id,
    });

    return res.status(201).json({
      message: "Lưu lesson thành công",
      saved,
    });
    } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
    }
};

export const getSavedLessons = async (req, res) => {
    try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: "Thiếu user_id" });
    }

    const lessons = await SavedLesson.find({ user_id })
            .populate("lesson_id");

        return res.status(200).json(lessons);
    } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
    }
};
