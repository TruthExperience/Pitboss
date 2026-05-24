import { Router } from "express";
import { processTelemetry } from "@engines/telemetry/parser";

const router = Router();

router.post("/upload", async (req, res) => {
  try {
    const { session } = req.body;

    if (!session) {
      return res.status(400).json({ error: "Missing telemetry session" });
    }

    const analysis = await processTelemetry(session);
    return res.json(analysis);
  } catch (err) {
    console.error("Telemetry error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
