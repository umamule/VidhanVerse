import mongoose from "mongoose";

const instituteProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  instituteName: String,
  address: String,
  contactEmail: String,
  phone: String,
  teachers: [{ name: String, email: String }],
  description: String,
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("InstituteProfile", instituteProfileSchema);
