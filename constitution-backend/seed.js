import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Resource from "./models/Resource.js";
import MockTest from "./models/MockTest.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/constitutionApp";
await mongoose.connect(MONGO_URI);

await Resource.deleteMany({});
await MockTest.deleteMany({});

const r1 = await Resource.create({
  type: "Act",
  title: "Right to Information Act, 2005",
  summary: "Empowers citizens to access government information.",
  fullText: "Full act text goes here...",
  tags: ["RTI","transparency"]
});

const r2 = await Resource.create({
  type: "Article",
  title: "Article 21 - Right to Life",
  articleNumber: "21",
  summary: "No person shall be deprived of his life or personal liberty.",
  tags: ["fundamental-rights","life"]
});

const test = await MockTest.create({
  title: "Basic Rights Mock Test",
  description: "Test on Articles 12-35",
  durationMinutes: 10,
  questions: [
    { q: "Article 21 guarantees?", options: ["Right to Property","Right to Life","Right to Religion","Right to Equality"], answerIndex: 1, explanation: "Article 21: Life & personal liberty." },
    { q: "Which act grants access to government records?", options: ["RTI Act 2005","IPC","CrPC","None"], answerIndex: 0 }
  ]
});

console.log("Seeded:", { r1, r2, test });
process.exit(0);
