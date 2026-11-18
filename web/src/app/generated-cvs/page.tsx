import LocalizedText from "@/components/localized-text";
import { getServerLocale } from "@/lib/i18n/server";
import { uiText } from "@/lib/i18n/dictionary";

import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default function GeneratedCVsListPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fffaf7] px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-2xl font-bold sm:text-3xl">
              CV-uri generate cu AI
            </h1>
            <p className="mt-4 text-slate-500">
              <LocalizedText source="Se încarcă CV-urile generate..." />
            </p>
          </div>
        </main>
      }
    >
      <GeneratedCVsContent />
    </Suspense>
  );
}

async function GeneratedCVsContent() {
  const locale = await getServerLocale();

  await connection();

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: generatedCVs, error } = await supabase
    .from("generated_cvs")
    .select(
      "id, original_cv_id, job_description, cv_language, ai_model, created_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#fffaf7] px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="text-sm text-[#d8432a] hover:underline"
        >{uiText(locale, "← Înapoi la Dashboard")}</Link>

        <div className="mt-6">
          <p className="text-sm font-medium text-[#d8432a]">
            CV Adapt
          </p>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{uiText(locale, "CV-uri generate cu AI")}</h1>

          <p className="mt-3 text-slate-500">{uiText(locale, "Aici găsești versiunile adaptate ale CV-urilor tale. Verifică fiecare rezultat înainte de utilizare.")}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/generated-cvs/new"
            className="rounded-lg bg-[#ef5135] px-4 py-3 text-center text-sm font-medium text-white hover:bg-[#d8432a]"
          >{locale === "en" ? "+ Generate CV with AI" : "+ Generează CV cu AI"}</Link>

          <Link
            href="/my-cvs"
            className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium hover:bg-orange-50"
          >{uiText(locale, "CV-urile originale")}</Link>

          <Link
            href="/cv"
            className="rounded-lg border border-slate-300 px-4 py-3 text-center text-sm font-medium hover:bg-orange-50"
          >{uiText(locale, "+ Creează CV nou")}</Link>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-8 rounded-lg border border-red-800 p-4 text-red-400"
          >{uiText(locale, "Nu am putut încărca CV-urile generate. Încearcă din nou.")}</p>
        ) : generatedCVs && generatedCVs.length > 0 ? (
          <div className="mt-8 space-y-4">
            {generatedCVs.map((cv) => (
              <article
                key={cv.id}
                className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6"
              >
                <h2 className="text-lg font-semibold">
                  {typeof cv.job_description === "string" && cv.job_description.startsWith("Job title: ")
                    ? cv.job_description.split("\n", 1)[0].replace("Job title: ", "")
                    : uiText(locale, "CV adaptat cu AI")}
                </h2>

                <p className="mt-3 text-sm text-slate-500">
                  {uiText(locale, "Generat la:")}{" "}
                  {new Date(cv.created_at).toLocaleDateString(
                    locale === "en" ? "en-GB" : "ro-RO",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      timeZone: "Europe/Bucharest",
                    }
                  )}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  {uiText(locale, "Limba")}:{" "}
                  {cv.cv_language === "en"
                    ? uiText(locale, "Engleză")
                    : uiText(locale, "Română")}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  AI model: {cv.ai_model}
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/generated-cvs/${cv.id}`}
                    className="rounded-lg bg-[#ef5135] px-4 py-3 text-center text-sm font-medium hover:bg-[#d8432a] text-white"
                  >{uiText(locale, "Previzualizează CV")}</Link>

                  <Link
                    href={`/my-cvs/${cv.original_cv_id}`}
                    className="rounded-lg border border-slate-300 px-4 py-3 text-center text-sm font-medium hover:bg-orange-50"
                  >{uiText(locale, "Vezi originalul")}</Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm p-8 text-center">
            <h2 className="text-lg font-semibold">{uiText(locale, "Nu ai CV-uri generate încă")}</h2>

            <p className="mt-3 text-slate-500">{uiText(locale, "După prima generare AI finalizată cu succes, CV-ul adaptat va apărea aici.")}</p>

            <Link
              href="/my-cvs"
              className="mt-5 inline-block text-[#d8432a] hover:underline"
            >{uiText(locale, "Vezi CV-urile originale →")}</Link>
          </section>
        )}
      </div>
    </main>
  );
}
