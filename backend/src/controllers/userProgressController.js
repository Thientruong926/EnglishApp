// controllers/userProgressController.js
import UserProgress from "../models/UserProgress.js";
import User from "../models/User.js";
import Lesson from "../models/Lesson.js";

export const createUserProgress = async (req, res) => {
    try {
        const { user_id, lesson_id, status } = req.body;

        if (!user_id || !lesson_id) {
            return res.status(400).json({ message: "Thiếu user_id hoặc lesson_id" });
        }

        // Kiểm tra tồn tại User và Lesson
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        const lesson = await Lesson.findById(lesson_id);
        if (!lesson) {
            return res.status(404).json({ message: "Không tìm thấy bài đọc" });
        }

        const userProgress = await UserProgress.create({
            user_id,
            lesson_id,
            status
        });

        return res.status(201).json({ message: "Thêm tiến độ thành công", userProgress });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getAllUserProgresses = async (req, res) => {
    try {
        const progresses = await UserProgress.find()
            .populate("user_id", "username email")
            .populate("lesson_id");
        return res.status(200).json(progresses);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getUserProgressById = async (req, res) => {
    try {
        const { id } = req.params;

        const userProgress = await UserProgress.findById(id)
            .populate("user_id", "username email")
            .populate("lesson_id");
        if (!userProgress) {
            return res.status(404).json({ message: "Không tìm thấy tiến độ" });
        }

        return res.status(200).json(userProgress);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getUserProgressesByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;

        const progresses = await UserProgress.find({ user_id })
            .populate("lesson_id")
            .populate("user_id", "username email");
        return res.status(200).json(progresses);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getProgressByUserAndLesson = async (req, res) => {
    try {
        const { user_id, lesson_id } = req.params;

        const progress = await UserProgress.findOne({
            user_id,
            lesson_id
        })
            .populate("user_id", "username email")
            .populate("lesson_id");

        if (!progress) {
            return res.status(404).json({ message: "Không tìm thấy tiến độ" });
        }

        return res.status(200).json(progress);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const updateUserProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, lesson_id, completed } = req.body;

        const userProgress = await UserProgress.findByIdAndUpdate(
            id,
            { user_id, lesson_id, completed },
            { new: true }
        );

        if (!userProgress) {
            return res.status(404).json({ message: "Không tìm thấy tiến độ" });
        }

        return res.status(200).json({ message: "Cập nhật tiến độ thành công", userProgress });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const deleteUserProgress = async (req, res) => {
    try {
        const { id } = req.params;

        const userProgress = await UserProgress.findByIdAndDelete(id);
        if (!userProgress) {
            return res.status(404).json({ message: "Không tìm thấy tiến độ" });
        }

        return res.status(200).json({ message: "Xóa tiến độ thành công" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
