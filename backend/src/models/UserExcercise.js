import mongoose, { model } from "mongoose";
const UserExerciseSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    exercise_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true
    },
    attempt: {
      type: Number,
      default: 1
    },
    score: {
      type: Number,
      min: 0
    },
    completed_at: {
      type: Date,
      default: Date.now
    }
  }
);

// 1 attempt / exercise / user là duy nhất
UserExerciseSchema.index(
  { user_id: 1, exercise_id: 1, attempt: 1 },
  { unique: true }
);
const UserExercise = mongoose.model("UserExercise",UserExerciseSchema);
export default UserExercise;