// controllers/vocabulary.controller.js
import Vocabulary from "../models/Vocabulary.js";

export const createVocabulary = async (req, res) => {
    try {
        const { word, meaning, example_sentence } = req.body;

        if (!word || !meaning) {
            return res.status(400).json({ message: "Thiếu word hoặc meaning" });
        }

        const exists = await Vocabulary.findOne({ word: word.toLowerCase() });
        if (exists) {
            return res.status(409).json({ message: "Từ vựng đã tồn tại" });
        }

        const vocab = await Vocabulary.create({ word, meaning, example_sentence });

        return res.status(201).json({ message: "Thêm từ vựng thành công", vocab });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getAllVocabulary = async (req, res) => {
    try {
        const vocabs = await Vocabulary.find();
        return res.status(200).json(vocabs);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getVocabularyById = async (req, res) => {
    try {
        const { id } = req.params;

        const vocab = await Vocabulary.findById(id);
        if (!vocab) {
            return res.status(404).json({ message: "Không tìm thấy từ vựng" });
        }

        return res.status(200).json(vocab);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
