
import Link from "next/link";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { generatedCVValidationSchema } from "@/lib/ai/generated-cv-validation";

type PersonalInfo = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
};

export default function GeneratedCVPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold">
              CV adaptat cu AI
            </h1>
            <p className="mt-4 text-gray-400">
              Se încarcă previzualizarea CV-ului...
            </p>
          </div>
        </main>
      }
    >
      <GeneratedCVContent params={params} />
    </Suspense>
  );
}

async function GeneratedCVContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: generatedCV, error: generatedError } =
    await supabase
      .from("generated_cvs")
      .select(
        "id, original_cv_id, generated_content, cv_language, ai_model, created_at"
      )
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

  if (generatedError) {
    throw new Error("Nu am putut încărca CV-ul generat.");
  }

  if (!generatedCV) {
    notFound();
  }

  const validationResult =
    generatedCVValidationSchema.safeParse(
      generatedCV.generated_content
    );

  if (!validationResult.success) {
    throw new Error(
      "CV-ul generat conține date invalide."
    );
  }

  const cvContent = validationResult.data;

  const { data: originalCV, error: originalError } =
    await supabase
      .from("cvs")
      .select("id, title, personal_info")
      .eq("id", generatedCV.original_cv_id)
      .eq("user_id", user.id)
      .maybeSingle();

  if (originalError) {
    throw new Error("Nu am putut încărca CV-ul original.");
  }

  if (!originalCV) {
    notFound();
  }

  const personal = (
    originalCV.personal_info ?? {}
  ) as PersonalInfo;

  const fullName = [
    personal.firstName,
    personal.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const en = generatedCV.cv_language === "en";

  const labels = en
    ? {
        back: "Back to generated CVs",
        title: "AI-adapted CV",
        download: "Download PDF",
        review: "Review before use",
        warning:
          "Check all AI-generated descriptions and the professional summary for accuracy before using this CV.",
        contact: "Contact details",
        summary: "Professional summary",
        experience: "Work experience",
        education: "Education",
        skills: "Skills",
        languages: "Languages",
        present: "Present",
        original: "View original CV",
        details: "Generation details",
        date: "Generated on",
        empty: "No information available.",
      }
    : {
        back: "Înapoi la CV-urile generate",
        title: "CV adaptat cu AI",
        download: "Descarcă PDF",
        review: "Verifică înainte de utilizare",
        warning:
          "Verifică toate descrierile și rezumatul profesional generate de AI înainte să folosești acest CV.",
        contact: "Date de contact",
        summary: "Rezumat profesional",
        experience: "Experiență profesională",
        education: "Educație și studii",
        skills: "Competențe profesionale",
        languages: "Limbi străine",
        present: "Prezent",
        original: "Vezi CV-ul original",
        details: "Detalii generare",
        date: "Generat la",
        empty: "Nu există informații.",
      };

  const generatedAt = new Date(generatedCV.created_at);

  const dateText = Number.isNaN(generatedAt.getTime())
    ? "—"
    : generatedAt.toLocaleString(
        en ? "en-GB" : "ro-RO",
        {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Europe/Bucharest",
        }
      );

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/generated-cvs"
          className="text-sm text-blue-400 hover:underline"
        >
          ← {labels.back}
        </Link>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">
            {labels.title}
          </h1>

          <a
            href={`/api/generated-cvs/${generatedCV.id}/pdf`}
            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            ↓ {labels.download}
          </a>
        </div>

        <section className="mt-8 rounded-xl border border-amber-700 bg-amber-950/20 p-6">
          <h2 className="font-semibold text-amber-300">
            {labels.review}
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            {labels.warning}
          </p>
        </section>

        <section className="mt-8 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold">
            {labels.contact}
          </h2>

          <div className="mt-4 space-y-2">
            {fullName && (
              <p className="text-lg font-medium">
                {fullName}
              </p>
            )}
            {personal.email && <p>{personal.email}</p>}
            {personal.phone && <p>{personal.phone}</p>}
            {personal.city && <p>{personal.city}</p>}
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold">
            {labels.summary}
          </h2>
          <p className="mt-4 whitespace-pre-wrap leading-7">
            {cvContent.professional_summary ||
              labels.empty}
          </p>
        </section>

        <section className="mt-8 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold">
            {labels.experience}
          </h2>

          {cvContent.experiences.length === 0 ? (
            <p className="mt-4 text-gray-400">
              {labels.empty}
            </p>
          ) : (
            cvContent.experiences.map((item, index) => (
              <article key={index} className="mt-6">
                <h3 className="text-lg font-semibold">
                  {item.jobTitle}
                </h3>
                <p className="mt-1">{item.company}</p>
                <p className="mt-1 text-sm text-gray-400">
                  {item.startDate} –{" "}
                  {item.current
                    ? labels.present
                    : item.endDate}
                </p>
                <p className="mt-3 whitespace-pre-wrap leading-7">
                  {item.description}
                </p>
              </article>
            ))
          )}
        </section>

        <section className="mt-8 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold">
            {labels.education}
          </h2>

          {cvContent.education.length === 0 ? (
            <p className="mt-4 text-gray-400">
              {labels.empty}
            </p>
          ) : (
            cvContent.education.map((item, index) => (
              <article key={index} className="mt-6">
                <h3 className="font-semibold">
                  {item.institution}
                </h3>
                <p className="mt-1">{item.degree}</p>
                <p className="mt-1 text-sm text-gray-400">
                  {item.startDate} –{" "}
                  {item.ongoing
                    ? labels.present
                    : item.endDate}
                </p>
              </article>
            ))
          )}
        </section>

        <section className="mt-8 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold">
            {labels.skills}
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {cvContent.skills.length === 0 ? (
              <p className="text-gray-400">
                {labels.empty}
              </p>
            ) : (
              cvContent.skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full border border-gray-600 px-3 py-2 text-sm"
                >
                  {skill}
                </span>
              ))
            )}
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold">
            {labels.languages}
          </h2>

          {cvContent.languages.length === 0 ? (
            <p className="mt-4 text-gray-400">
              {labels.empty}
            </p>
          ) : (
            cvContent.languages.map((language, index) => (
              <p
                key={`${language.name}-${index}`}
                className="mt-3"
              >
                {language.name} — {language.level}
              </p>
            ))
          )}
        </section>

        <section className="mt-8 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold">
            {labels.details}
          </h2>
          <p className="mt-4 text-sm text-gray-400">
            Model: {generatedCV.ai_model}
          </p>
          <p className="mt-2 text-sm text-gray-400">
            {labels.date}: {dateText}
          </p>

          <Link
            href={`/my-cvs/${originalCV.id}`}
            className="mt-5 inline-block text-blue-400 hover:underline"
          >
            {labels.original}: {originalCV.title} →
          </Link>
        </section>
      </div>
    </main>
  );
}
