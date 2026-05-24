"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TelemetryPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:4000/telemetry/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Telemetry Analysis</h1>

      <Card className="p-6 bg-neutral-900 border-neutral-700 space-y-4">
        <input
          type="file"
          accept=".csv,.json"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-white"
        />

        <Button onClick={handleUpload} disabled={loading || !file}>
          {loading ? "Analyzing..." : "Upload Telemetry"}
        </Button>
      </Card>

      {result && (
        <Card className="p-6 bg-neutral-900 border-neutral-700 space-y-4">
          <h2 className="text-xl font-semibold">Analysis Results</h2>

          {result.summary && (
            <p className="whitespace-pre-line">{result.summary}</p>
          )}

          {result.metrics && (
            <>
              <h3 className="font-semibold mt-4">Metrics</h3>
              <ul className="list-disc ml-6">
                {Object.entries(result.metrics).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ))}
              </ul>
            </>
          )}

          {result.recommendations && (
            <>
              <h3 className="font-semibold mt-4">Recommendations</h3>
              <ul className="list-disc ml-6">
                {result.recommendations.map((rec: string, i: number) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
