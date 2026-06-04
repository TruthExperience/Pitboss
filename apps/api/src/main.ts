import express from "express";
import cors from "cors";

import healthRoutes from "./routes/healthRoutes";
import examRoutes from "./routes/examRoutes";
import advisorRoutes from "./routes/advisorRoutes";
import telemetryRoutes from "./routes/telemetryRoutes";

const app = express();

const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

// Health route
app.use("/", healthRoutes);

// API routes
app.use("/exam", examRoutes);
app.use("/advisor", advisorRoutes);
app.use("/telemetry", telemetryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.listen(PORT, () => {
  console.log(`PitBoss API running on port ${PORT}`);
});
