// controllers/userExercise.controller.js
import UserExercise from "../models/UserExercise.js";
export const submitExercise = async (req, res) => {
  try {
    const { user_id, exercise_id, score } = req.body; // lấy user_id trực tiếp

    if (!user_id || !exercise_id || score === undefined) {
      return res.status(400).json({ message: "Thiếu user_id, exercise_id hoặc score" });
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
    // có thể lấy user_id từ query hoặc body
    const user_id = req.query.user_id || req.body.user_id;

    if (!user_id) {
      return res.status(400).json({ message: "Thiếu user_id" });
    }

    const results = await UserExercise.find({ user_id })
      .populate("exercise_id");

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
