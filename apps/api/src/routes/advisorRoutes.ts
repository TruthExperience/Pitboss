import { Router } from "express";
import { db } from "@pitboss/db/src/client";
import { processAdvisor } from "@engines/advisor/advisorEngine";

const router = Router();

router.post("/run", async (req, res) => {
  try {
    const { examResult, driver_id } = req.body;

    if (!examResult || !driver_id) {
      return res.status(400).json({ error: "Missing exam result or driver_id" });
    }

    // Run advisor engine
    const session = await processAdvisor(examResult);

    // Insert into advisor_sessions
    const { data, error } = await db
      .from("advisor_sessions")
      .insert({
        driver_id,
        question: session.question,
        answer: session.answer,
      })
      .select()
      .single();

    if (error) {
      console.error("DB insert error:", error);
      return res.status(500).json({ error: "Failed to save advisor session" });
    }

    // Return saved session
    return res.json(data);
  } catch (err) {
    console.error("Advisor error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
