// controllers/lessonVocabularyController.js
import LessonVocabulary from "../models/LessonVocabulary.js";
import Lesson from "../models/Lesson.js";
import Vocabulary from "../models/Vocabulary.js";

export const createLessonVocabulary = async (req, res) => {
    try {
        const { lesson_id, vocab_id } = req.body;

        if (!lesson_id || !vocab_id) {
            return res.status(400).json({ message: "Thiếu lesson_id hoặc vocab_id" });
        }

        // Kiểm tra tồn tại Lesson và Vocabulary trước khi tạo liên kết
        const lesson = await Lesson.findById(lesson_id);
        if (!lesson) {
            return res.status(404).json({ message: "Không tìm thấy bài đọc" });
        }

        const vocab = await Vocabulary.findById(vocab_id);
        if (!vocab) {
            return res.status(404).json({ message: "Không tìm thấy từ vựng" });
        }

        const lessonVocab = await LessonVocabulary.create({
            lesson_id,
            vocab_id
        });

        return res.status(201).json({ message: "Thêm liên kết thành công", lessonVocab });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getAllLessonVocabularies = async (req, res) => {
    try {
        const lessonVocabs = await LessonVocabulary.find()
            .populate("lesson_id")
            .populate("vocab_id");
        return res.status(200).json(lessonVocabs);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getLessonVocabularyById = async (req, res) => {
    try {
        const { id } = req.params;

        const lessonVocab = await LessonVocabulary.findById(id)
            .populate("lesson_id")
            .populate("vocab_id");
        if (!lessonVocab) {
            return res.status(404).json({ message: "Không tìm thấy liên kết" });
        }

        return res.status(200).json(lessonVocab);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getVocabulariesByLessonId = async (req, res) => {
    try {
        const { lesson_id } = req.params;

        const vocabs = await LessonVocabulary.find({ lesson_id: lesson_id })
            .populate("vocab_id");
        return res.status(200).json(vocabs);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const updateLessonVocabulary = async (req, res) => {
    try {
        const { id } = req.params;
        const { lesson_id, vocab_id } = req.body;

        const lessonVocab = await LessonVocabulary.findByIdAndUpdate(
            id,
            { lesson_id, vocab_id },
            { new: true }
        )
            .populate("lesson_id")
            .populate("vocab_id");

        if (!lessonVocab) {
            return res.status(404).json({ message: "Không tìm thấy liên kết" });
        }

        return res.status(200).json({ message: "Cập nhật liên kết thành công", lessonVocab });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const deleteLessonVocabulary = async (req, res) => {
    try {
        const { id } = req.params;

        const lessonVocab = await LessonVocabulary.findByIdAndDelete(id);
        if (!lessonVocab) {
            return res.status(404).json({ message: "Không tìm thấy liên kết" });
        }

        return res.status(200).json({ message: "Xóa liên kết thành công" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
