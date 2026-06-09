"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Nav from "@/components/Nav";

export default function ExamPage() {
  const { session, loading: authLoading, isAuthenticated } = useAuth();

  const [questions, setQuestions] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) return;

    async function loadQuestions() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/exam/questions`
        );
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        setError("Failed to load exam questions.");
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [session]);

  function selectAnswer(questionId: number, choice: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: choice }));
  }

  async function submitExam() {
    if (!session) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/exam/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: session.user.id,
            answers,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to submit exam");

      const data = await res.json();
      setResult(data.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit exam"
      );
    } finally {
      setSubmitting(false);
    }
  }

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

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-neutral-400">Loading exam...</p>
      </div>
    );
  }

  if (result) {
    return (
      <>
        <Nav />
        <div className="p-8 text-center space-y-6">
          <h1 className="text-4xl font-bold">Exam Results</h1>

          <p className="text-neutral-300 text-xl">
            Score:{" "}
            <span className="text-white font-semibold">
              {result.score}%
            </span>
          </p>

          {result.passed ? (
            <p className="text-green-400 text-xl font-semibold">
              You passed! 🎉
            </p>
          ) : (
            <p className="text-red-400 text-xl font-semibold">
              You did not pass. Try again after reviewing the material.
            </p>
          )}

          {result.weakAreas?.length > 0 && (
            <div className="mt-4">
              <p className="text-neutral-400 mb-2">Areas to review:</p>
              <ul className="list-disc ml-6 text-neutral-300 space-y-1">
                {result.weakAreas.map((area: string, i: number) => (
                  <li key={i}>{area}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => {
              setResult(null);
              setAnswers({});
              setIndex(0);
            }}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded transition"
          >
            Retake Exam
          </button>
        </div>
      </>
    );
  }

  const q = questions[index];

  if (!q) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-400">No exam questions available.</p>
      </div>
    );
  }

  return (
    <>
      <Nav />

      <div className="p-8 max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Certification Exam</h1>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <div className="bg-neutral-900 border border-neutral-700 p-6 rounded space-y-4">
          <h2 className="text-2xl font-semibold">
            Question {index + 1} of {questions.length}
          </h2>

          <p className="text-neutral-300">{q.question}</p>

          <div className="space-y-3">
            {q.choices.map((choice: string) => (
              <button
                key={choice}
                onClick={() => selectAnswer(q.id, choice)}
                className={`block w-full text-left px-4 py-2 rounded border transition ${
                  answers[q.id] === choice
                    ? "bg-blue-600 border-blue-500"
                    : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
                }`}
              >
                {choice}
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded disabled:opacity-40"
            >
              Back
            </button>

            {index < questions.length - 1 ? (
              <button
                onClick={() => setIndex(index + 1)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
              >
                Next
              </button>
            ) : (
              <button
                onClick={submitExam}
                disabled={submitting}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded disabled:opacity-40"
              >
                {submitting ? "Submitting..." : "Submit Exam"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
