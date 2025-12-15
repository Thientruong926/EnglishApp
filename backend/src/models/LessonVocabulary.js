import mongoose from "mongoose";

const LessonVocabularySchema = new mongoose.Schema(
  {
    lesson_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true
    },
    vocab_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vocabulary',
      required: true
    }
  },
  { timestamps: true }
);

LessonVocabularySchema.index(
  { lesson_id: 1, vocab_id: 1 },
  { unique: true }
);

const LessonVocabulary = mongoose.model('LessonVocabulary', LessonVocabularySchema);
export default LessonVocabulary