"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Nav from "@/components/Nav";

interface AdvisorResponse {
  answer: string;
  recommendations?: string[];
}

export default function AdvisorPage() {
  const { session, isAuthenticated, loading: authLoading } = useAuth();

  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [response, setResponse] = useState<AdvisorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    if (!session) {
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

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/advisor/run`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driver_id: session.user.id,
            question,
            category,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to get advisor response");

      const data = await res.json();
      setResponse(data.data);
    } catch (err) {
      console.error("Advisor request failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to contact Advisor"
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-neutral-400">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold">Please log in</h1>
      </div>
    );
  }

  return (
    <>
      <Nav />

      <div className="p-8 max-w-2xl mx-auto space-y-6">
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
            <p className="font-medium mb-2">Category (optional)</p>
            <Input
              value={category}
              className="bg-neutral-800 border-neutral-700"
              placeholder="racecraft, rules, setup, strategy..."
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
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
            <h2 className="text-xl font-semibold">Advisor Response</h2>
            <p className="whitespace-pre-line">{response.answer}</p>

            {response.recommendations && response.recommendations.length > 0 && (
              <>
                <h3 className="font-semibold mt-4">Recommendations</h3>
                <ul className="list-disc ml-6">
                  {response.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
