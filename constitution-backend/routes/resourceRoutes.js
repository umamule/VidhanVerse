import express from "express";
import Resource from "../models/Resource.js";

const router = express.Router();

// ✅ Base route for testing
router.get("/", (req, res) => {
  res.json({ ok: true, message: "Resources API is running" });
});

// GET /api/resources/search?q=...&type=Act
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q || "";
    const type = req.query.type; // optional filter
    const regex = new RegExp(q, "i");

    const filter = {
      $or: [{ title: regex }, { summary: regex }, { tags: regex }, { fullText: regex }],
    };
    if (type) filter.type = type;

    const results = await Resource.find(filter).limit(50);
    res.json({ ok: true, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// GET /api/resources/:id
router.get("/:id", async (req, res) => {
  try {
    const r = await Resource.findById(req.params.id);
    if (!r) return res.status(404).json({ ok: false, message: "Not found" });
    res.json({ ok: true, resource: r });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;
