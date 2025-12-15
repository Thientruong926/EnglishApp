// controllers/userFolder.controller.js
import UserFolder from "../models/UserFolder.js";

export const createFolder = async (req, res) => {
    try {
        const { name } = req.body;
        const user_id = req.user.id;

        if (!name) {
            return res.status(400).json({ message: "Tên folder không được trống" });
        }

        const exists = await UserFolder.findOne({ user_id, name });
        if (exists) {
            return res.status(409).json({ message: "Folder đã tồn tại" });
        }

        const folder = await UserFolder.create({ user_id, name });

        return res.status(201).json({ message: "Tạo folder thành công", folder });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getUserFolders = async (req, res) => {
    try {
        const folders = await UserFolder.find({ user_id: req.user.id });
        return res.status(200).json(folders);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const deleteFolder = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const folder = await UserFolder.findOneAndDelete({ _id: id, user_id });
        if (!folder) {
            return res.status(404).json({ message: "Folder không tồn tại" });
        }

        return res.status(200).json({ message: "Xóa folder thành công" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
