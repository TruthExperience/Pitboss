import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// Health route (must be near the top)
app.use("/", healthRoutes);

// Other API routes
import examRoutes from "./routes/examRoutes";
import advisorRoutes from "./routes/advisorRoutes";
import telemetryRoutes from "./routes/telemetryRoutes";

app.use("/exam", examRoutes);
app.use("/advisor", advisorRoutes);
app.use("/telemetry", telemetryRoutes);

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`PitBoss API running on http://localhost:${PORT}`);
});
