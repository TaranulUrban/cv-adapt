import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateAdaptedCV } from "@/lib/ai/generate-cv";
import { assertGeneratedCVIsValid } from "@/lib/ai/verify-generated-cv";
import { originalCVSchema } from "@/lib/ai/original-cv-validation";
import { calculateAIUsage } from "@/lib/ai/usage-cost";
import { protectGeneratedCV } from "@/lib/ai/protect-generated-cv";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Trebuie să fii autentificat." },
      { status: 401 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Cerere JSON invalidă." },
      { status: 400 }
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("cvId" in body) ||
    typeof body.cvId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.cvId)
  ) {
    return NextResponse.json(
      { error: "Identificator CV invalid." },
      { status: 400 }
    );
  }

  const { data: cv, error: cvError } = await supabase
    .from("cvs")
    .select("id, experiences, education, skills, languages, job_info")
    .eq("id", body.cvId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (cvError) {
    return NextResponse.json(
      { error: "Nu am putut verifica CV-ul." },
      { status: 500 }
    );
  }

  if (!cv) {
    return NextResponse.json(
      { error: "CV-ul nu există sau nu îți aparține." },
      { status: 404 }
    );
  }

    const jobInfo = cv.job_info as {
    jobDescription?: unknown;
    cvLanguage?: unknown;
  } | null;

  const jobDescription = jobInfo?.jobDescription;

  if (
    typeof jobDescription !== "string" ||
    jobDescription.trim().length < 50
  ) {
    return NextResponse.json(
      {
        error:
          "Descrierea jobului trebuie să conțină minimum 50 de caractere.",
      },
      { status: 400 }
    );
  }

  if (jobDescription.length > 15000) {
    return NextResponse.json(
      {
        error:
          "Descrierea jobului este prea lungă (maximum 15.000 de caractere).",
      },
      { status: 400 }
    );
  }

  if (
    jobInfo?.cvLanguage !== "ro" &&
    jobInfo?.cvLanguage !== "en"
  ) {
    return NextResponse.json(
      { error: "Limba CV-ului trebuie să fie română sau engleză." },
      { status: 400 }
    );
  }

    // Rezervarea va fi activată după implementarea
  // completării și tratării eșecurilor.
  const verifiedCvId = cv.id;
  const verifiedUserId = user.id;

  const validationResult = originalCVSchema.safeParse({
  experiences: cv.experiences,
  education: cv.education,
  skills: cv.skills,
  languages: cv.languages,
});

if (!validationResult.success) {
  return NextResponse.json(
    { error: "CV-ul conține date invalide. Verifică informațiile introduse." },
    { status: 400 }
  );
}

const cvForAI = validationResult.data;

  const cvForAIJson = JSON.stringify(cvForAI);

  if (cvForAIJson.length > 30000) {
    return NextResponse.json(
      {
        error:
          "CV-ul este prea lung pentru generarea AI. Limita este de 30.000 de caractere.",
      },
      { status: 400 }
    );
  }

  


  
    async function reserveGeneration() {
    const { data, error } = await supabase.rpc(
      "reserve_ai_generation",
      { p_cv_id: verifiedCvId }
    );

   if (error) {
  if (error.message.includes("Daily AI generation limit reached")) {
    throw new Error("AI_DAILY_LIMIT_REACHED");
  }

  console.error("Supabase AI reservation failed:", error.code);
  throw new Error("AI_RESERVATION_FAILED");
}

    return data as string;
  }

  async function failGeneration(
  userId: string,
  requestId: string
) {
  const admin = createAdminClient();

  const { data, error } = await admin.rpc(
    "fail_ai_generation",
    {
      p_user_id: userId,
      p_request_id: requestId,
    }
  );

  if (error) {
    throw new Error(
      "Nu am putut marca generarea ca eșuată."
    );
  }

  return data as boolean;
}

async function completeGeneration(
  userId: string,
  requestId: string,
  generatedContent: Record<string, unknown>,
  jobDescription: string,
  cvLanguage: "ro" | "en",
  usage: {
    model: string;
    inputTokens: number;
    outputTokens: number;
    reasoningTokens: number;
    estimatedCostUsd: number;
  }
) {
  const admin = createAdminClient();

  const { data, error } = await admin.rpc(
    "complete_ai_generation",
    {
      p_user_id: userId,
      p_request_id: requestId,
      p_generated_content: generatedContent,
      p_job_description: jobDescription,
      p_cv_language: cvLanguage,
      p_ai_model: usage.model,
      p_input_tokens: usage.inputTokens,
      p_output_tokens: usage.outputTokens,
      p_reasoning_tokens: usage.reasoningTokens,
      p_estimated_cost_usd: usage.estimatedCostUsd,
    }
  );

  if (error) {
    throw new Error("Nu am putut salva CV-ul generat.");
  }

  return data as string;
}

  async function markGenerationFailed(requestId: string): Promise<void> {
  try {
    const marked = await failGeneration(verifiedUserId, requestId);

    if (!marked) {
      console.error("Generarea AI nu a putut fi marcată ca eșuată.");
    }
  } catch (error) {
    console.error("Eroare la actualizarea generării AI:", error);
  }
}


let requestId: string;

try {
  requestId = await reserveGeneration();
} catch (error) {
  if (
    error instanceof Error &&
    error.message === "AI_DAILY_LIMIT_REACHED"
  ) {
    return NextResponse.json(
      { error: "Ai atins limita de 5 generări AI pentru astăzi." },
      { status: 429 }
    );
  }

  console.error("Eroare tehnică la rezervarea AI:", error);

  return NextResponse.json(
    { error: "Serviciul de generare este temporar indisponibil." },
    { status: 500 }
  );
}

try {
  const result = await generateAdaptedCV(
    cvForAI,
    jobDescription,
    jobInfo.cvLanguage
  );

  const protectedCV = protectGeneratedCV(cvForAI, result.content);

  assertGeneratedCVIsValid(cvForAI, protectedCV);

  const usage = calculateAIUsage(result.usage);

  const generatedCvId = await completeGeneration(
    verifiedUserId,
    requestId,
    result.content,
    jobDescription,
    jobInfo.cvLanguage,
    {
      model: result.model,
      ...usage,
    }
  );

  return NextResponse.json({
    success: true,
    generatedCvId,
    usage,
  });
} catch (error) {
  console.error("Generarea CV-ului a eșuat:", error);

  await markGenerationFailed(requestId);

  return NextResponse.json(
    { error: "Generarea CV-ului a eșuat. Te rugăm să încerci mai târziu." },
    { status: 500 }
  );
}
}