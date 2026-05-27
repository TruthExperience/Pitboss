import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { user_id, answers } = await req.json();

    if (!user_id || !answers) {
      return NextResponse.json(
        { error: "Missing user_id or answers" },
        { status: 400 }
      );
    }

    // Fetch all questions
    const { data: questions, error } = await supabase
      .from("exam_questions")
      .select("*");

    if (error || !questions) {
      return NextResponse.json(
        { error: "Failed to load questions" },
        { status: 500 }
      );
    }

    // Grade exam
    let correct = 0;
    let total = questions.length;

    for (const q of questions) {
      if (answers[q.id] === q.answer) {
        correct++;
      }
    }

    const score = Math.round((correct / total) * 100);
    const passed = score >= 80;

    // Insert exam result
    const { data: result, error: insertError } = await supabase
      .from("exam_results")
      .insert({
        driver_id: user_id,
        score,
        weak_areas: {}, // optional for now
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to save exam result" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      score,
      passed,
      correct,
      incorrect: total - correct,
      result,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: String(err) },
      { status: 500 }
    );
  }
}
