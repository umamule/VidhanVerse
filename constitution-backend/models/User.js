import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["citizen","institute"], required: true },
  progress: {
    lessonsCompleted: { type: [Number], default: [] },
    quizzesCompleted: { type: [Number], default: [] },
    quizScores: { type: Map, of: Number, default: {} },
  },
});

export default mongoose.model("User", userSchema);
