// controllers/uservocabularyController.js
import UserVocabulary from "../models/UserVocabulary.js";

// Thêm từ vựng cho user
export const addVocabularyToUser = async (req, res) => {
  try {
    const user_id = req.body.user_id; // nhận trực tiếp từ frontend
    const { vocab_id, folder_id } = req.body;

    if (!user_id || !vocab_id || !folder_id) {
      return res.status(400).json({ message: "Thiếu user_id, vocab_id hoặc folder_id" });
    }

    const exists = await UserVocabulary.findOne({ user_id, vocab_id });
    if (exists) {
      return res.status(409).json({ message: "Từ vựng đã tồn tại trong danh sách" });
    }

    const userVocab = await UserVocabulary.create({
      user_id,
      vocab_id,
      folder_id
    });

    return res.status(201).json({ message: "Thêm từ vựng thành công", userVocab });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Lấy danh sách từ vựng của user (optionally theo folder)
export const getUserVocabularies = async (req, res) => {
  try {
    const user_id = req.query.user_id || req.body.user_id;
    if (!user_id) return res.status(400).json({ message: "Thiếu user_id" });

    const condition = { user_id };
    if (req.query.folder_id) condition.folder_id = req.query.folder_id;

    const vocabs = await UserVocabulary.find(condition)
      .populate("vocab_id")
      .populate("folder_id");

    return res.status(200).json(vocabs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Đánh dấu từ vựng đã học
export const markVocabularyLearned = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await UserVocabulary.findByIdAndUpdate(
      id,
      { is_learned: true },
      { new: true }
    );

    return res.status(200).json({ message: "Đã đánh dấu học", updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Xóa từ vựng khỏi danh sách user
export const deleteUserVocabulary = async (req, res) => {
  try {
    const { id } = req.params;

    await UserVocabulary.findByIdAndDelete(id);

    return res.status(200).json({ message: "Xóa từ vựng khỏi danh sách" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
