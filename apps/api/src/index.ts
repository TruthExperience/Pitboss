import express from "express";
import cors from "cors";

import healthRoutes from "./routes/healthRoutes";
import examRoutes from "./routes/examRoutes";
import advisorRoutes from "./routes/advisorRoutes";
import telemetryRoutes from "./routes/telemetryRoutes";

const app = express();

const PORT = Number(process.env.PORT) || 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

// Health
app.use("/", healthRoutes);

// API Routes
app.use("/exam", examRoutes);
app.use("/advisor", advisorRoutes);
app.use("/telemetry", telemetryRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
);

app.listen(PORT, () => {
  console.log(`PitBoss API running on port ${PORT}`);
});
