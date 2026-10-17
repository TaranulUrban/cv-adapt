import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      { error: "Autentificare necesară." },
      { status: 401 }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Cheia OpenAI nu este configurată." },
      { status: 503 }
    );
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      reasoning: { effort: "minimal" },
      input: "Răspunde exact cu textul: CV Adapt AI funcționează!",
      max_output_tokens: 300,
      store: false,
    });

    return NextResponse.json({
      message: response.output_text,
    });
  } catch (error) {
    const apiError = error as {
        status?: number;
        code?: string;
        type?: string;
    };

    console.error("OpenAI diagnostic:", {
        name: error instanceof Error ? error.name : "Unknown",
        status: apiError?.status ?? null,
        code: apiError?.code ?? null,
        type: apiError?.type ?? null,
    });

    return NextResponse.json(
      { error: "Testul OpenAI a eșuat. Verifică configurarea și creditul API." },
      { status: 502 }
    );
  }
}