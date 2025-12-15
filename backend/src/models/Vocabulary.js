// Vocabulary.js
import mongoose from "mongoose";

const VocabularySchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
      unique: true
    },
    meaning: {
      type: String,
      required: true
    },
    example_sentence: {
      type: String
    }
  },
  { timestamps: true }
);

const Vocabulary = mongoose.model('Vocabulary', VocabularySchema);
export default Vocabulary;
