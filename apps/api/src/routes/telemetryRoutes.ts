import { Router } from "express";
import { db } from "@pitboss/db/src/client";
import { processTelemetry } from "@engines/telemetry/parser";

const router = Router();

router.post("/upload", async (req, res) => {
  try {
    const { session, driver_id } = req.body;

    if (!session || !driver_id) {
      return res.status(400).json({ error: "Missing session or driver_id" });
    }

    // Run telemetry engine
    const analysis = await processTelemetry(session);

    // Insert into telemetry_analysis
    const { data, error } = await db
      .from("telemetry_analysis")
      .insert({
        driver_id,
        summary: analysis.summary,
        metrics: analysis.metrics,
      })
      .select()
      .single();

    if (error) {
      console.error("DB insert error:", error);
      return res.status(500).json({ error: "Failed to save telemetry analysis" });
    }

    // Return saved analysis
    return res.json(data);
  } catch (err) {
    console.error("Telemetry error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
