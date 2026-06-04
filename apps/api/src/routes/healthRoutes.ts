import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    status: "ok",
    service: "pitboss-api",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? "development",
  });
});

export default router;
