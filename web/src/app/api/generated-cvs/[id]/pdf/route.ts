
import { NextResponse } from "next/server";
import { createElement, type ReactElement } from "react";
import {
  renderToBuffer,
  type DocumentProps,
} from "@react-pdf/renderer";

import { createClient } from "@/lib/supabase/server";
import { generatedCVValidationSchema } from "@/lib/ai/generated-cv-validation";
import GeneratedCVDocument from "@/lib/pdf/generated-cv-document";


type PersonalInfo = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Autentificare necesară." },
      { status: 401 }
    );
  }

  const { data: generatedCV, error: generatedError } =
    await supabase
      .from("generated_cvs")
      .select(
        "id, original_cv_id, generated_content, cv_language"
      )
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

  if (generatedError) {
    return NextResponse.json(
      { error: "Nu am putut încărca CV-ul." },
      { status: 500 }
    );
  }

  if (!generatedCV) {
    return NextResponse.json(
      { error: "CV-ul nu a fost găsit." },
      { status: 404 }
    );
  }

  const parsed = generatedCVValidationSchema.safeParse(
    generatedCV.generated_content
  );

  if (!parsed.success) {
    return NextResponse.json(
      { error: "CV-ul conține date invalide." },
      { status: 422 }
    );
  }

  const { data: originalCV, error: originalError } =
    await supabase
      .from("cvs")
      .select("personal_info")
      .eq("id", generatedCV.original_cv_id)
      .eq("user_id", user.id)
      .maybeSingle();

  if (originalError) {
    return NextResponse.json(
      { error: "Nu am putut încărca datele personale." },
      { status: 500 }
    );
  }

  if (!originalCV) {
    return NextResponse.json(
      { error: "CV-ul original nu a fost găsit." },
      { status: 404 }
    );
  }

  const personal = (
    originalCV.personal_info ?? {}
  ) as PersonalInfo;

  try {
    const document = createElement(GeneratedCVDocument, {
      personal,
      content: parsed.data,
      cvLanguage: generatedCV.cv_language,
    }) as ReactElement<DocumentProps>;

    const buffer = await renderToBuffer(document);

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="CV-Adapt.pdf"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Eroare export PDF:", error);

    return NextResponse.json(
      { error: "Nu am putut genera documentul PDF." },
      { status: 500 }
    );
  }
}
