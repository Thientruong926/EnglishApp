// controllers/readingHistoryController.js
import ReadingHistory from "../models/ReadingHistory.js";
import User from "../models/User.js";
import Lesson from "../models/Lesson.js";

export const createReadingHistory = async (req, res) => {
    try {
        const { user_id, lesson_id, started_at, finished_at } = req.body;

        if (!user_id || !lesson_id) {
            return res.status(400).json({ message: "Thiếu user_id hoặc lesson_id" });
        }

        // Kiểm tra tồn tại User và Lesson trước khi tạo lịch sử
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        const lesson = await Lesson.findById(lesson_id);
        if (!lesson) {
            return res.status(404).json({ message: "Không tìm thấy bài đọc" });
        }

        const history = await ReadingHistory.create({
            user_id,
            lesson_id,
            started_at,
            finished_at
        });

        return res.status(201).json({ message: "Thêm lịch sử đọc thành công", history });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getAllReadingHistories = async (req, res) => {
    try {
        const histories = await ReadingHistory.find()
            .populate("user_id", "username email")
            .populate("lesson_id");
        return res.status(200).json(histories);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getReadingHistoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const history = await ReadingHistory.findById(id)
            .populate("user_id", "username email")
            .populate("lesson_id");
        if (!history) {
            return res.status(404).json({ message: "Không tìm thấy lịch sử" });
        }

        return res.status(200).json(history);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getReadingHistoriesByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;

        const histories = await ReadingHistory.find({ user_id })
            .populate("lesson_id")
            .populate("user_id", "username email");
        return res.status(200).json(histories);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getReadingHistoriesByLessonId = async (req, res) => {
    try {
        const { lesson_id } = req.params;

        const histories = await ReadingHistory.find({ lesson_id })
            .populate("lesson_id")
            .populate("user_id", "username email");
        return res.status(200).json(histories);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const updateReadingHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, lesson_id, started_at, finished_at } = req.body;

        const history = await ReadingHistory.findByIdAndUpdate(
            id,
            { user_id, lesson_id, started_at, finished_at },
            { new: true }
        );

        if (!history) {
            return res.status(404).json({ message: "Không tìm thấy lịch sử" });
        }

        return res.status(200).json({ message: "Cập nhật lịch sử thành công", history });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const deleteReadingHistory = async (req, res) => {
    try {
        const { id } = req.params;

        const history = await ReadingHistory.findByIdAndDelete(id);
        if (!history) {
            return res.status(404).json({ message: "Không tìm thấy lịch sử" });
        }

        return res.status(200).json({ message: "Xóa lịch sử thành công" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
