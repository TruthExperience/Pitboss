"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface AdvisorResponse {
  answer: string;
  recommendations?: string[];
}

export default function AdvisorPage() {
  const { user } = useAuth();

  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [response, setResponse] = useState<AdvisorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    if (!user) {
      setError("You must be logged in to use Advisor.");
      return;
    }

    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResponse(null);

      const payload = {
        driver_id: user.id,
        question,
        category,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/advisor/run`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to get advisor response");
      }

      const data = await res.json();

      setResponse(data);
    } catch (err) {
      console.error("Advisor request failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to contact Advisor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">PitBoss Advisor</h1>

      <Card className="p-6 bg-neutral-900 border-neutral-700 space-y-4">
        <div>
          <p className="font-medium mb-2">Question</p>

          <Textarea
            value={question}
            className="bg-neutral-800 border-neutral-700"
            placeholder="Ask anything about racecraft, rules, setups, strategy..."
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div>
          <p className="font-medium mb-2">
            Category (optional)
          </p>

          <Input
            value={category}
            className="bg-neutral-800 border-neutral-700"
            placeholder="racecraft, rules, setup, strategy..."
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm">
            {error}
          </div>
        )}

        <Button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
        >
          {loading ? "Thinking..." : "Ask Advisor"}
        </Button>
      </Card>

      {response && (
        <Card className="p-6 bg-neutral-900 border-neutral-700 space-y-4">
          <h2 className="text-xl font-semibold">
            Advisor Response
          </h2>

          <p className="whitespace-pre-line">
            {response.answer}
          </p>

          {response.recommendations &&
            response.recommendations.length > 0 && (
              <>
                <h3 className="font-semibold mt-4">
                  Recommendations
                </h3>

                <ul className="list-disc ml-6">
                  {response.recommendations.map(
                    (rec, index) => (
                      <li key={index}>{rec}</li>
                    )
                  )}
                </ul>
              </>
            )}
        </Card>
      )}
    </div>
  );
}
