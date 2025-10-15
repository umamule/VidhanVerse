import express from "express";
import InstituteProfile from "../models/InstituteProfile.js";
import User from "../models/User.js";

const router = express.Router();

// NOTE: for simplicity this example expects userId passed in body/query.
// In production, use JWT auth middleware to derive userId securely.

router.get("/profile", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ ok: false, message: "userId required" });
  const p = await InstituteProfile.findOne({ userId }).populate("resources");
  if (!p) return res.json({ ok: true, profile: null });
  res.json({ ok: true, profile: p });
});

router.post("/profile", async (req, res) => {
  const userId = req.body.userId;
  if (!userId) return res.status(400).json({ ok: false, message: "userId required" });

  const payload = {
    userId,
    instituteName: req.body.instituteName,
    address: req.body.address,
    contactEmail: req.body.contactEmail,
    phone: req.body.phone,
    description: req.body.description,
    teachers: req.body.teachers || [],
    resources: req.body.resources || []
  };

  let p = await InstituteProfile.findOneAndUpdate({ userId }, payload, { upsert: true, new: true });
  res.json({ ok: true, profile: p });
});

export default router;
