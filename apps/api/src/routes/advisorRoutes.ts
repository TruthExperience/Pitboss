import { Router } from "express";
import { processAdvisor } from "@engines/advisor/advisorEngine";

const router = Router();

router.post("/run", async (req, res) => {
  try {
    const { examResult } = req.body;

    if (!examResult) {
      return res.status(400).json({ error: "Missing exam result" });
    }

    const session = await processAdvisor(examResult);
    return res.json(session);
  } catch (err) {
    console.error("Advisor error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
