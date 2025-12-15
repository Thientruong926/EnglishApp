import mongoose from "mongoose";

const UserFolderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

// 1 user không tạo trùng tên folder
UserFolderSchema.index(
  { user_id: 1, name: 1 },
  { unique: true }
);

const UserFolder = mongoose.model('UserFolder', UserFolderSchema);
export default UserFolder;
