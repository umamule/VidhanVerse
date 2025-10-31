import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import instituteRoutes from "./routes/instituteRoutes.js";
import mockRoutes from "./routes/mockRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://root:root@cluster0.zutiyhk.mongodb.net/";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected."))
  .catch((err) => console.error("MongoDB error:", err));

// Remove authRoutes since you don’t want it
// app.use("/api/auth", authRoutes);

app.use("/api/resources", resourceRoutes);
app.use("/api/mock", mockRoutes);
app.use("/api/institute", instituteRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on ${PORT}`));
