// controllers/userFolder.controller.js
import UserFolder from "../models/UserFolder.js";
import UserVocabulary from "../models/UserVocabulary.js";
import Vocabulary from "../models/Vocabulary.js";

/**
 * Tạo folder mới
 */
export const createFolder = async (req, res) => {
  try {
    const { name, user_id } = req.body;

    if (!user_id) return res.status(400).json({ message: "Thiếu user_id" });
    if (!name) return res.status(400).json({ message: "Tên folder không được trống" });

    const exists = await UserFolder.findOne({ user_id, name });
    if (exists) return res.status(409).json({ message: "Folder đã tồn tại" });

    const folder = await UserFolder.create({ user_id, name });
    return res.status(201).json({ message: "Tạo folder thành công", folder });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

/**
 * Lấy danh sách folder kèm vocab
 */
export const getUserFolders = async (req, res) => {
  try {
    const user_id = req.query.user_id || req.body.user_id;
    if (!user_id) return res.status(400).json({ message: "Thiếu user_id" });

    const folders = await UserFolder.find({ user_id });

    // Lấy vocab cho từng folder
    const foldersWithVocabs = await Promise.all(
      folders.map(async (folder) => {
        const userVocabs = await UserVocabulary.find({ user_id, folder_id: folder._id }).populate('vocab_id');
        // map chỉ lấy đối tượng vocab
        const vocabs = userVocabs.map(uv => uv.vocab_id);
        return {
          _id: folder._id,
          name: folder.name,
          createdAt: folder.createdAt,
          updatedAt: folder.updatedAt,
          vocabularies: vocabs
        };
      })
    );

    return res.status(200).json(foldersWithVocabs);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

/**
 * Xóa folder
 */
export const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) return res.status(400).json({ message: "Thiếu user_id" });

    const folder = await UserFolder.findOneAndDelete({ _id: id, user_id });
    if (!folder) return res.status(404).json({ message: "Folder không tồn tại" });

    // Xóa luôn userVocabs liên quan
    await UserVocabulary.deleteMany({ user_id, folder_id: id });

    return res.status(200).json({ message: "Xóa folder thành công" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

/**
 * Thêm vocab vào folder
 */
export const addVocabToFolder = async (req, res) => {
  try {
    const { folder_id } = req.params;
    const { user_id, vocab_id } = req.body;

    if (!user_id || !vocab_id) return res.status(400).json({ message: "Thiếu user_id hoặc vocab_id" });

    // Kiểm tra đã tồn tại chưa
    const exists = await UserVocabulary.findOne({ user_id, folder_id, vocab_id });
    if (exists) return res.status(409).json({ message: "Từ vựng đã tồn tại trong folder" });

    const userVocab = await UserVocabulary.create({ user_id, folder_id, vocab_id });

    // Populate vocab_id để frontend nhận đủ thông tin
    await userVocab.populate('vocab_id');

    return res.status(201).json({ message: "Thêm từ vựng thành công", userVocab });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
