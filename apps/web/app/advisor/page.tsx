"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function AdvisorPage() {
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    setResponse(null);

    const payload = {
      driver_id: user.id,
      question,
      category,
    };

    const res = await fetch("http://localhost:4000/advisor/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setResponse(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">PitBoss Advisor</h1>

      <Card className="p-6 bg-neutral-900 border-neutral-700 space-y-4">
        <div>
          <p className="font-medium mb-2">Question</p>
          <Textarea
            className="bg-neutral-800 border-neutral-700"
            placeholder="Ask anything about racecraft, rules, setups, strategy..."
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div>
          <p className="font-medium mb-2">Category (optional)</p>
          <Input
            className="bg-neutral-800 border-neutral-700"
            placeholder="racecraft, rules, setup, strategy..."
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <Button onClick={handleAsk} disabled={loading}>
          {loading ? "Thinking..." : "Ask Advisor"}
        </Button>
      </Card>

      {response && (
        <Card className="p-6 bg-neutral-900 border-neutral-700 space-y-4">
          <h2 className="text-xl font-semibold">Advisor Response</h2>
          <p className="whitespace-pre-line">{response.answer}</p>

          {response.recommendations && (
            <>
              <h3 className="font-semibold mt-4">Recommendations</h3>
              <ul className="list-disc ml-6">
                {response.recommendations.map((rec: string, i: number) => (
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
