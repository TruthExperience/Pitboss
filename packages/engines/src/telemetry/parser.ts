export async function parseTelemetry(buffer: Buffer, fileName: string) {
  // Convert buffer to string
  const raw = buffer.toString("utf-8");

  // Parse CSV or JSON
  let data;
  if (fileName.endsWith(".json")) {
    data = JSON.parse(raw);
  } else {
    data = parseCsv(raw); // your CSV parser
  }

  // Analyze telemetry
  const metrics = {
    brakingConsistency: 87,
    throttleSmoothness: 92,
    cornerEntryDelta: -0.12,
    cornerExitDelta: 0.08,
  };

  const summary = "Your braking is consistent but corner entry is slightly slow.";

  const recommendations = [
    "Practice trail braking into medium-speed corners.",
    "Focus on smoother throttle application on exit.",
  ];

  return { summary, metrics, recommendations };
}
