import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";

const examSubmissionSchema = z.object({
  user_id: z.string().uuid(),
  answers: z.record(z.any()),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, answers } = examSubmissionSchema.parse(body);

    const { data: questions, error: questionsError } = await supabase
      .from("exam_questions")
      .select("*");

    if (questionsError || !questions) {
      console.error("Question load error:", questionsError);

      return NextResponse.json(
        {
          success: false,
          error: "Failed to load questions",
        },
        { status: 500 }
      );
    }

    if (questions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No exam questions found",
        },
        { status: 500 }
      );
    }

    let correct = 0;
    const weakAreas: string[] = [];

    for (const question of questions) {
      const userAnswer = answers[question.id];

      if (userAnswer === question.answer) {
        correct++;
      } else if (question.category) {
        weakAreas.push(question.category);
      }
    }

    const total = questions.length;
    const incorrect = total - correct;
    const score = Math.round((correct / total) * 100);
    const passed = score >= 80;

    const { data: result, error: insertError } = await supabase
      .from("exam_results")
      .insert({
        driver_id: user_id,
        score,
        passed,
        weak_areas: [...new Set(weakAreas)],
      })
      .select()
      .single();

    if (insertError) {
      console.error("Exam result insert error:", insertError);

      return NextResponse.json(
        {
          success: false,
          error: "Failed to save exam result",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        score,
        passed,
        correct,
        incorrect,
        weakAreas: [...new Set(weakAreas)],
        result,
      },
    });
  } catch (error) {
    console.error("Exam grading error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request payload",
          details: error.flatten(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}Math.round((correct / total) * 100);
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
