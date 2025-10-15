import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  q: String,
  options: [String],
  answerIndex: Number,
  explanation: String,
  resourceRef: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" } // optional link
});

const mockTestSchema = new mongoose.Schema({
  title: String,
  description: String,
  durationMinutes: Number,
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("MockTest", mockTestSchema);
