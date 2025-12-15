// controllers/userExercise.controller.js
import UserExercise from "../models/UserExercise.js";

export const submitExercise = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { exercise_id, score } = req.body;

        if (!exercise_id || score === undefined) {
            return res.status(400).json({ message: "Thiếu exercise_id hoặc score" });
        }

        const result = await UserExercise.create({
            user_id,
            exercise_id,
            score
        });

        return res.status(201).json({ message: "Nộp bài thành công", result });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getUserExerciseResults = async (req, res) => {
    try {
        const results = await UserExercise.find({ user_id: req.user.id })
            .populate("exercise_id");

        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
