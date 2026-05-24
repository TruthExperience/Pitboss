"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ExamPage() {
  const [questions] = useState([
    { id: "q1", text: "What is proper blue flag behavior?" },
    { id: "q2", text: "When is overtaking under yellow flags allowed?" },
  ]);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    const submission = {
      examId: "example-exam",
      userId: "test-user",
      answers,
    };

    const res = await fetch("http://localhost:4000/exam/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions, submission }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">PitBoss Exam</h1>

      {result ? (
        <Card className="bg-neutral-900 border-neutral-700">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <p>Score: {result.score}%</p>
          <p>Correct: {result.correct}</p>
          <p>Incorrect: {result.incorrect}</p>

          <h3 className="mt-4 font-semibold">Weak Areas</h3>
          {Object.keys(result.weakAreas || {}).length === 0 ? (
            <p>No weak areas detected.</p>
          ) : (
            <ul className="list-disc ml-6">
              {Object.entries(result.weakAreas).map(([cat, acc]) => (
                <li key={cat}>
                  {cat}: {acc}%
                </li>
              ))}
            </ul>
          )}

          <Button className="mt-6" onClick={() => setResult(null)}>
            Take Again
          </Button>
        </Card>
      ) : (
        <Card className="bg-neutral-900 border-neutral-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Questions</h2>

          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id}>
                <p className="font-medium mb-2">{q.text}</p>
                <Input
                  className="bg-neutral-800 border-neutral-700"
                  onChange={(e) =>
                    setAnswers({ ...answers, [q.id]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>

          <Button className="mt-6" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Exam"}
          </Button>
        </Card>
      )}
    </div>
  );
}
