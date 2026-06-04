import { Router } from "express";
import { z } from "zod";
import { db } from "@pitboss/db/src/client";

const router = Router();

const driverIdSchema = z.string().uuid();

router.get("/:id", async (req, res) => {
  try {
    const driverId = driverIdSchema.parse(req.params.id);

    const [
      driverResult,
      activityResult,
      examsResult,
      advisorResult,
      telemetryResult,
      certsResult,
    ] = await Promise.all([
      db
        .from("drivers")
        .select("*")
        .eq("id", driverId)
        .single(),

      db
        .from("driver_activity")
        .select("*")
        .eq("driver_id", driverId)
        .single(),

      db
        .from("exam_results")
        .select("*")
        .eq("driver_id", driverId)
        .order("created_at", { ascending: false }),

      db
        .from("advisor_sessions")
        .select("*")
        .eq("driver_id", driverId)
        .order("created_at", { ascending: false }),

      db
        .from("telemetry_analysis")
        .select("*")
        .eq("driver_id", driverId)
        .order("created_at", { ascending: false }),

      db
        .from("driver_certifications")
        .select("*")
        .eq("driver_id", driverId)
        .order("earned_at", { ascending: false }),
    ]);

    if (driverResult.error || !driverResult.data) {
      return res.status(404).json({
        success: false,
        error: "Driver not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        driver: driverResult.data,
        activity: activityResult.data ?? null,
        exams: examsResult.data ?? [],
        advisor: advisorResult.data ?? [],
        telemetry: telemetryResult.data ?? [],
        certifications: certsResult.data ?? [],
      },
    });
  } catch (error) {
    console.error("Driver profile lookup failed:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid driver ID format",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to load driver profile",
    });
  }
});

export default router;
