import { Router } from "express";
import { z } from "zod";
import { db } from "@pitboss/db/src/client";
import { processTelemetry } from "@engines/telemetry/parser";

const router = Router();

const telemetryUploadSchema = z.object({
  driver_id: z.string().uuid(),
  session: z.any(),
});

router.post("/upload", async (req, res) => {
  try {
    const { driver_id, session } =
      telemetryUploadSchema.parse(req.body);

    const analysis = await processTelemetry(session);

    if (!analysis?.summary || !analysis?.metrics) {
      return res.status(500).json({
        success: false,
        error: "Telemetry engine returned invalid analysis",
      });
    }

    const { data, error } = await db
      .from("telemetry_analysis")
      .insert({
        driver_id,
        summary: analysis.summary,
        metrics: analysis.metrics,
        analyzed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Telemetry analysis insert failed:", error);

      return res.status(500).json({
        success: false,
        error: "Failed to save telemetry analysis",
      });
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Telemetry upload error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid request payload",
        details: error.flatten(),
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export default router;
