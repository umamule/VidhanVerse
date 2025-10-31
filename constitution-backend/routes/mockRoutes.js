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

// get quiz by lesson id and game id (for CitizenLearning)
router.get("/quiz/:lessonId/:gameId", async (req, res) => {
  const lessonId = req.params.lessonId;
  const gameId = req.params.gameId || 1; // Default to 1 if not provided
  // Map lesson and game to title
  const titleMap = {
    1: { 1: "Article 14 Quiz", 2: "Article 14 True/False" } // Add more lessons and games as needed
  };
  const lessonTitles = titleMap[lessonId];
  if (!lessonTitles) return res.status(404).json({ ok: false, message: "No quizzes for this lesson" });
  const title = lessonTitles[gameId];
  if (!title) return res.status(404).json({ ok: false, message: "Quiz not found for this game" });
  const test = await MockTest.findOne({ title });
  if (!test) return res.status(404).json({ ok: false, message: "Quiz not found" });
  // Return questions with answers for now (to match existing screens)
  const questions = test.questions.map(q => ({
    question: q.q,
    options: q.options,
    answer: q.answerIndex,
    explanation: q.explanation
  }));
  res.json({ questions });
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
