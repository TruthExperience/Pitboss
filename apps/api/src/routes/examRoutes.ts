import { Router } from "express";
import { processExam } from "@engines/exam/examEngine";

const router = Router();

router.post("/submit", async (req, res) => {
  try {
    const { questions, submission } = req.body;

    if (!questions || !submission) {
      return res.status(400).json({ error: "Missing exam data" });
    }

    const result = await processExam(questions, submission);
    return res.json(result);
  } catch (err) {
    console.error("Exam processing error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
