import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  type: { type: String, enum: ["Act","Article","CaseLaw"], required: true },
  title: { type: String, required: true },
  articleNumber: String, // optional for articles
  actYear: String, // optional for acts
  summary: String,
  fullText: String, // optional/large
  citations: [String],
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Resource", resourceSchema);
