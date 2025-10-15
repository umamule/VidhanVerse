import express from "express";
import MockTest from "../models/MockTest.js";

const router = express.Router();

// list tests
router.get("/", async (req, res) => {
  const items = await MockTest.find({}, "title description durationMinutes");
  res.json({ ok: true, items });
});

// get test by id (no answers sent until submission)
router.get("/:id", async (req, res) => {
  const test = await MockTest.findById(req.params.id).select("-questions.answerIndex -questions.explanation");
  if (!test) return res.status(404).json({ ok: false, message: "Not found" });
  res.json({ ok: true, test });
});

// submit answers -> check score
router.post("/:id/submit", async (req, res) => {
  const answers = req.body.answers; // array of selected indexes
  const test = await MockTest.findById(req.params.id);
  if (!test) return res.status(404).json({ ok: false, message: "Not found" });

  let correct = 0;
  const feedback = test.questions.map((q, i) => {
    const isCorrect = q.answerIndex === answers[i];
    if (isCorrect) correct++;
    return {
      q: q.q,
      selected: answers[i],
      correctIndex: q.answerIndex,
      explanation: q.explanation || ""
    };
  });

  res.json({ ok: true, score: correct, total: test.questions.length, feedback });
});

export default router;
