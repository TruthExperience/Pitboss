"use client";

import { useEffect, useState, useContext } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AuthContext } from "@/components/AuthProvider";
import Nav from "@/components/Nav";

export default function ExamPage() {
  const session = useContext(AuthContext);

  const [questions, setQuestions] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!session) return;

    async function loadQuestions() {
      const { data, error } = await supabase
        .from("exam_questions")
        .select("*")
        .order("id", { ascending: true });

      if (!error && data) {
        setQuestions(data);
      }

      setLoading(false);
    }

    loadQuestions();
  }, [session]);

  function selectAnswer(questionId: number, choice: string) {
    setAnswers((prev: any) => ({
      ...prev,
      [questionId]: choice
    }));
  }

  async function submitExam() {
    setSubmitting(true);

    const payload = {
      user_id: session.user.id,
      answers
    };

    const res = await fetch("/api/exam/grade", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    setResult(data);
    setSubmitting(false);
  }

  if (!session) {
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
        </div>
      </>
    );
  }

  const q = questions[index];

  return (
    <>
      <Nav />

      <div className="p-8 max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Certification Exam</h1>

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
