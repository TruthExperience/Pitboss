import { Router } from "express";
import { db } from "@pitboss/db/src/client";

const router = Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const { data: driver } = await db
    .from("drivers")
    .select("*")
    .eq("id", id)
    .single();

  const { data: exams } = await db
    .from("exam_results")
    .select("*")
    .eq("driver_id", id)
    .order("created_at", { ascending: false });

  const { data: advisor } = await db
    .from("advisor_sessions")
    .select("*")
    .eq("driver_id", id)
    .order("created_at", { ascending: false });

  const { data: telemetry } = await db
    .from("telemetry_analysis")
    .select("*")
    .eq("driver_id", id)
    .order("created_at", { ascending: false });

  const { data: certs } = await db
    .from("driver_certifications")
    .select("*")
    .eq("driver_id", id)
    .order("earned_at", { ascending: false });

  res.json({ driver, exams, advisor, telemetry, certs });
});

export default router;
