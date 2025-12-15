// UserProgress.js
import mongoose from "mongoose";

const UserVocabularySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    vocab_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vocabulary',
      required: true
    },
    folder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserFolder',
      required: true
    },
    is_learned: {
      type: Boolean,
      default: false
    },
    added_at: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

// Tránh user add 1 từ nhiều lần
UserVocabularySchema.index(
  { user_id: 1, vocab_id: 1 },
  { unique: true }
);

const UserVocabulary  = mongoose.model('UserVocabulary', UserVocabularySchema);
export default UserVocabulary;
