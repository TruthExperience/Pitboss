import express from "express";
import cors from "cors";

import examRoutes from "./routes/examRoutes";
import advisorRoutes from "./routes/advisorRoutes";
import telemetryRoutes from "./routes/telemetryRoutes";

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("PitBossOS API Running");
});

// Mount routes
app.use("/exam", examRoutes);
app.use("/advisor", advisorRoutes);
app.use("/telemetry", telemetryRoutes);

app.listen(4000, () => {
  console.log("API running on http://localhost:4000");
});
